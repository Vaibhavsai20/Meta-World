import 'dotenv/config';
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import nodemailer from 'nodemailer';

const app = express();
const PORT = Number(process.env.PORT || 5000);
//const clientOrigin = process.env.CLIENT_ORIGIN || 'http://localhost:5173';

const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:5174',
  'http://127.0.0.1:5173',
  'http://127.0.0.1:5174',
  process.env.CLIENT_ORIGIN
].filter(Boolean);

app.use(helmet());
//app.use(cors({ origin: clientOrigin }));

//const allowedOrigins = [
//  'http://localhost:5173',
// 'http://127.0.0.1:5173'
//];

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      return callback(null, true);
    }
    return callback(new Error('Origin not allowed by CORS'));
  }
}));

app.use(express.json({ limit: '20kb' }));
app.use('/api/contact', rateLimit({ windowMs: 15 * 60 * 1000, limit: 8, standardHeaders: 'draft-7', legacyHeaders: false }));

const enquirySchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true, maxlength: 100 },
  email: { type: String, required: true, trim: true, lowercase: true, maxlength: 254 },
  project: { type: String, trim: true, maxlength: 120, default: '' },
  message: { type: String, trim: true, maxlength: 5000, default: '' },
  confirmationEmailSent: { type: Boolean, default: false }
}, { timestamps: true });
const Enquiry = mongoose.model('Enquiry', enquirySchema);

function clean(value, max = 5000) {
  return typeof value === 'string' ? value.trim().slice(0, max) : '';
}

function getMailer() {
  if (!process.env.EMAIL_USER || !process.env.EMAIL_APP_PASSWORD) return null;
  return nodemailer.createTransport({
    service: process.env.EMAIL_SERVICE || 'gmail',
    auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_APP_PASSWORD }
  });
}

app.get('/api/health', (_req, res) => res.json({ ok: true }));

app.post('/api/contact', async (req, res) => {
  try {
    const name = clean(req.body?.name, 100);
    const email = clean(req.body?.email, 254).toLowerCase();
    const project = clean(req.body?.project, 120);
    const message = clean(req.body?.message, 5000);
    if (!name || !email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return res.status(400).json({ message: 'Please enter your name and a valid email address.' });
    }
    if (message.length > 5000) return res.status(400).json({ message: 'Message is too long.' });

    // Save first. A mail delivery failure must not discard the enquiry.
    const enquiry = await Enquiry.create({ name, email, project, message });
    let confirmationEmailSent = false;
    const mailer = getMailer();
    if (mailer) {
      try {
        await mailer.sendMail({
          from: process.env.EMAIL_FROM || process.env.EMAIL_USER,
          to: email,
          subject: 'We received your message — MetaWorld',
          text: `Hi ${name},\n\nThanks for contacting MetaWorld. We have received your enquiry and will get back to you soon.\n\nProject: ${project || 'Not specified'}\n\nYour message:\n${message || 'No additional details provided'}\n\nMetaWorld Studio`,
          html: `<p>Hi ${escapeHtml(name)},</p><p>Thanks for contacting MetaWorld. We have received your enquiry and will get back to you soon.</p><p><strong>Project:</strong> ${escapeHtml(project || 'Not specified')}</p><p><strong>Your message:</strong><br>${escapeHtml(message || 'No additional details provided').replace(/\n/g, '<br>')}</p><p>MetaWorld Studio</p>`
        });
        confirmationEmailSent = true;
        enquiry.confirmationEmailSent = true;
        await enquiry.save();
      } catch (mailError) {
        console.error('Confirmation email failed:', mailError.message);
      }
    }
    return res.status(201).json({ message: 'Enquiry saved successfully.', enquiryId: enquiry._id, confirmationEmailSent });
  } catch (error) {
    console.error('Contact API error:', error.message);
    if (error.name === 'ValidationError') return res.status(400).json({ message: 'Please check the submitted details.' });
    return res.status(500).json({ message: 'We could not save your message. Please try again later.' });
  }
});

function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[char]);
}

async function start() {
  if (!process.env.MONGODB_URI) throw new Error('MONGODB_URI is missing. Add it to server/.env.');
  await mongoose.connect(process.env.MONGODB_URI);
  app.listen(PORT, () => console.log(`MetaWorld API listening on http://localhost:${PORT}`));
}

start().catch(error => {
  console.error('Could not start API:', error.message);
  process.exit(1);
});
