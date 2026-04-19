import emailjs from '@emailjs/browser'

// Generate a Google Meet-style link using a random room
export function generateMeetLink() {
  const chars = 'abcdefghijklmnopqrstuvwxyz'
  const segment = (len) => Array.from({ length: len }, () => chars[Math.floor(Math.random() * chars.length)]).join('')
  return `https://meet.jit.si/MargaDarshak-${segment(4)}-${segment(4)}-${segment(4)}`
}

// Send email to ONE recipient
async function sendEmail({ toEmail, toName, studentName, mentorName, date, time, meetLink }) {
  return emailjs.send(
    process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID,
    process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID,
    {
      to_email:     toEmail,
      to_name:      toName,
      student_name: studentName,
      mentor_name:  mentorName,
      date,
      time,
      meet_link:    meetLink,
    },
    process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY
  )
}

// Send to both student AND mentor
export async function sendBookingEmails({ studentName, studentEmail, mentorName, mentorEmail, date, time, meetLink }) {
  emailjs.init(process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY)

  const results = await Promise.allSettled([
    // Email to student
    sendEmail({
      toEmail:     studentEmail,
      toName:      studentName,
      studentName,
      mentorName,
      date,
      time,
      meetLink,
    }),
    // Email to mentor
    sendEmail({
      toEmail:     mentorEmail,
      toName:      mentorName,
      studentName,
      mentorName,
      date,
      time,
      meetLink,
    }),
  ])

  const failed = results.filter(r => r.status === 'rejected')
  if (failed.length > 0) {
    console.warn('Some emails failed to send:', failed)
  }

  return results
}
