import { CONFIG } from './config.js';

const SMS_API_URL = CONFIG.SMS.API_URL;
const SMS_API_URL_MANY = CONFIG.SMS.API_URL_MANY;
const SMS_API_KEY = CONFIG.SMS.API_KEY;
const SMS_SENDER_ID = CONFIG.SMS.SENDER_ID;

/**
 * Send SMS using BulkSMSBD API
 * @param {string} number - Phone number to send SMS to
 * @param {string} message - Message content
 * @returns {Promise<Object>} - API response
 */
export async function sendSMS(number, message) {
  try {
    console.log(`📱 === sendSMS DEBUG START ===`);
    console.log(`📱 Sending SMS to: ${number}`);
    console.log(`📱 Message length: ${message.length} characters`);
    console.log(`📱 SMS API URL: ${SMS_API_URL}`);
    console.log(`📱 SMS API Key: ${SMS_API_KEY ? 'Present' : 'Missing'}`);
    console.log(`📱 SMS Sender ID: ${SMS_SENDER_ID}`);
    
    const requestBody = {
      api_key: SMS_API_KEY,
      type: 'text',
      number: number,
      senderid: SMS_SENDER_ID,
      message: message
    };
    console.log(`📱 Request body:`, requestBody);
    
    const response = await fetch(SMS_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody)
    });

    console.log(`📱 Response status: ${response.status}`);
    const result = await response.json();
    console.log(`📱 API Response:`, result);
    
    if (result.response_code === 202) { // Changed from 1000 to 202 based on actual API response
      console.log(`✅ SMS sent successfully to ${number}`);
      console.log(`📱 === sendSMS DEBUG END ===`);
      return {
        success: true,
        message: 'SMS sent successfully',
        data: result
      };
    } else {
      console.error(`❌ SMS failed for ${number}:`, result.error_message);
      console.log(`📱 === sendSMS DEBUG END ===`);
      return {
        success: false,
        message: result.error_message || 'SMS sending failed',
        data: result
      };
    }
  } catch (error) {
    console.error(`❌ SMS error for ${number}:`, error);
    console.log(`📱 === sendSMS DEBUG END ===`);
    return {
      success: false,
      message: 'Network error while sending SMS',
      error: error.message
    };
  }
}

/**
 * Send multiple SMS messages together using BulkSMSBD API
 * @param {Array} messages - Array of objects with 'to' and 'message' properties
 * @returns {Promise<Object>} - API response
 */
export async function sendBulkSMS(messages) {
  try {
    console.log(`📱 Sending bulk SMS to ${messages.length} recipients`);
    
    // Validate messages array
    if (!Array.isArray(messages) || messages.length === 0) {
      return {
        success: false,
        message: 'Messages array is empty or invalid'
      };
    }

    // Validate each message object
    for (let i = 0; i < messages.length; i++) {
      const msg = messages[i];
      if (!msg.to || !msg.message) {
        return {
          success: false,
          message: `Invalid message object at index ${i}. Must have 'to' and 'message' properties`
        };
      }
    }

    const response = await fetch(SMS_API_URL_MANY, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        api_key: SMS_API_KEY,
        senderid: SMS_SENDER_ID,
        messages: messages
      })
    });

    const result = await response.json();
    
    if (result.response_code === 1000) {
      console.log(`✅ Bulk SMS sent successfully to ${messages.length} recipients`);
      return {
        success: true,
        message: 'Bulk SMS sent successfully',
        data: result,
        totalSent: messages.length
      };
    } else {
      console.error(`❌ Bulk SMS failed:`, result.error_message);
      return {
        success: false,
        message: result.error_message || 'Bulk SMS sending failed',
        data: result
      };
    }
  } catch (error) {
    console.error(`❌ Bulk SMS error:`, error);
    return {
      success: false,
      message: 'Network error while sending bulk SMS',
      error: error.message
    };
  }
}

/**
 * Send bulk SMS with message generation function
 * @param {Array} recipients - Array of recipient objects
 * @param {Function} messageGenerator - Function to generate message for each recipient
 * @returns {Promise<Object>} - API response
 */
export async function sendBulkSMSWithGenerator(recipients, messageGenerator) {
  try {
    console.log(`📱 Preparing bulk SMS for ${recipients.length} recipients`);
    
    // Generate messages for each recipient
    const messages = recipients.map(recipient => {
      const message = messageGenerator(recipient);
      return {
        to: recipient.phone || recipient.smsPhone,
        message: message
      };
    });

    // Filter out invalid messages
    const validMessages = messages.filter(msg => msg.to && msg.message);
    
    if (validMessages.length === 0) {
      return {
        success: false,
        message: 'No valid messages to send'
      };
    }

    console.log(`📱 Sending ${validMessages.length} valid messages out of ${recipients.length} recipients`);
    
    return await sendBulkSMS(validMessages);
    
  } catch (error) {
    console.error(`❌ Bulk SMS with generator error:`, error);
    return {
      success: false,
      message: 'Error generating bulk SMS messages',
      error: error.message
    };
  }
}

/**
 * Generate welcome message for new student
 * @param {string} studentName - Student's name
 * @param {string} categoryTitle - Category title
 * @param {number} rentAmount - Rent amount
 * @returns {string} - Formatted welcome message
 */
export function generateWelcomeMessage(studentName, categoryTitle, rentAmount) {
  const formattedAmount = new Intl.NumberFormat('en-IN').format(rentAmount);
  
  return `🎓 Welcome to Avilash Palace!

Dear ${studentName},

✅ Your registration has been completed successfully!
📋 Category: ${categoryTitle}
💰 Monthly Rent: ৳${formattedAmount}

📞 For any queries, contact us:
📱 Phone: ${CONFIG.SUPPORT.PHONE}
📧 Email: ${CONFIG.SUPPORT.EMAIL}
🔗 Website: ${CONFIG.SUPPORT.WEBSITE}

🏠 We hope you have a wonderful stay with us!

Best regards,
Avilash Palace`;
}

/**
 * Generate payment confirmation message
 * @param {string} studentName - Student's name
 * @param {number} amount - Payment amount
 * @param {string} paymentMethod - Payment method
 * @returns {string} - Formatted payment confirmation message
 */
export function generatePaymentConfirmationMessage(studentName, amount, paymentMethod) {
  const formattedAmount = new Intl.NumberFormat('en-IN').format(amount);
  
  return `💳 Payment Confirmation

Dear ${studentName},

✅ Your payment has been received successfully!
💰 Amount: ৳${formattedAmount}
💳 Method: ${paymentMethod}
📅 Date: ${new Date().toLocaleDateString('en-IN')}

📊 Payment Status: CONFIRMED

Thank you for your payment!

Best regards,
Avilash Palace`;
}

/**
 * Generate rent reminder message
 * @param {string} studentName - Student's name
 * @param {number} rentDue - Rent due amount
 * @param {number} externalDue - External due amount
 * @param {number} advanceDue - Advance due amount
 * @param {string} dueDate - Due date
 * @param {string} bikashNumber - Bikash number for payment
 * @param {number} previousDue - Previous due amount (optional)
 * @returns {string} - Formatted rent reminder message
 */
export function generateRentReminderMessage(studentName, rentDue, externalDue, advanceDue, dueDate, bikashNumber, previousDue = 0) {
  const totalDue = rentDue + externalDue + advanceDue + previousDue;
  const formattedTotal = new Intl.NumberFormat('en-IN').format(totalDue);
  const formattedRent = new Intl.NumberFormat('en-IN').format(rentDue);
  const formattedExternal = new Intl.NumberFormat('en-IN').format(externalDue);
  const formattedAdvance = new Intl.NumberFormat('en-IN').format(advanceDue);
  const formattedPrevious = new Intl.NumberFormat('en-IN').format(previousDue);
  
  let breakdownText = `📋 Due Breakdown:
• Rent: ৳${formattedRent}
• External: ৳${formattedExternal}
• Advance: ৳${formattedAdvance}`;

  // Add previous due if it exists
  if (previousDue > 0) {
    breakdownText += `\n• Previous Due: ৳${formattedPrevious}`;
  }
  
  return `⏰ Rent Reminder

Dear ${studentName},

📅 Your rent is due on: ${dueDate}
💰 Total Due Amount: ৳${formattedTotal}

${breakdownText}

💳 Payment Methods:
• Cash
• Mobile Banking (Bkash/Nagad)

📱 Online Payment:
Bkash: ${bikashNumber}
🔗 Payment Request: ${CONFIG.PAYMENT.PAYMENT_REQUEST_URL}

📞 For assistance: ${CONFIG.SUPPORT.PHONE}

Best regards,
Avilash Palace`;
}

/**
 * Generate complaint status update message
 * @param {string} studentName - Student's name
 * @param {string} complaintTitle - Complaint title
 * @param {string} status - Complaint status
 * @returns {string} - Formatted complaint status message
 */
export function generateComplaintStatusMessage(studentName, complaintTitle, status) {
  const statusEmoji = {
    'pending': '⏳',
    'checking': '🔍',
    'solved': '✅',
    'canceled': '❌'
  };
  
  const statusText = {
    'pending': 'Pending',
    'checking': 'Under Review',
    'solved': 'Resolved',
    'canceled': 'Canceled'
  };
  
  return `📝 Complaint Status Update

Dear ${studentName},

${statusEmoji[status]} Your complaint has been updated:
📋 Title: ${complaintTitle}
🔄 Status: ${statusText[status]}

We are working to resolve your issue as soon as possible.

📞 For urgent matters: ${CONFIG.SUPPORT.PHONE}

Best regards,
Avilash Palace`;
}

/**
 * Generate general notification message
 * @param {string} studentName - Student's name
 * @param {string} title - Notification title
 * @param {string} message - Notification message
 * @returns {string} - Formatted notification message
 */
export function generateNotificationMessage(studentName, title, message) {
  return `📢 Important Notice

Dear ${studentName},

📋 ${title}

${message}

📞 For queries: ${CONFIG.SUPPORT.PHONE}

Best regards,
Avilash Palace`;
}

/**
 * Generate rent payment confirmation message
 * @param {string} studentName - Student's name
 * @param {Object} paymentDetails - Payment details object
 * @returns {string} - Formatted rent payment confirmation message
 */
export function generateRentPaymentConfirmationMessage(studentName, paymentDetails) {
  const {
    rentPaid = 0,
    advancePaid = 0,
    externalPaid = 0,
    previousDuePaid = 0,
    totalPaid = 0,
    paymentType = 'on hand',
    newStatus = 'partial'
  } = paymentDetails;

  const formattedTotal = new Intl.NumberFormat('en-IN').format(totalPaid);
  const formattedRent = new Intl.NumberFormat('en-IN').format(rentPaid);
  const formattedAdvance = new Intl.NumberFormat('en-IN').format(advancePaid);
  const formattedExternal = new Intl.NumberFormat('en-IN').format(externalPaid);
  const formattedPrevious = new Intl.NumberFormat('en-IN').format(previousDuePaid);

  let breakdownText = '';
  if (rentPaid > 0) breakdownText += `• Rent: ৳${formattedRent}\n`;
  if (advancePaid > 0) breakdownText += `• Advance: ৳${formattedAdvance}\n`;
  if (externalPaid > 0) breakdownText += `• External: ৳${formattedExternal}\n`;
  if (previousDuePaid > 0) breakdownText += `• Previous Due: ৳${formattedPrevious}\n`;

  const statusEmoji = newStatus === 'paid' ? '✅' : '💰';
  const statusText = newStatus === 'paid' ? 'FULLY PAID' : 'PARTIALLY PAID';

  return `💳 Rent Payment Confirmation

Dear ${studentName},

${statusEmoji} Your payment has been received successfully!
💰 Total Amount: ৳${formattedTotal}
💳 Payment Method: ${paymentType}
📅 Date: ${new Date().toLocaleDateString('en-IN')} ${new Date().toLocaleTimeString('en-IN')}
🔄 Status: ${statusText}

📋 Payment Breakdown:
${breakdownText}
📊 Total Paid: ৳${formattedTotal}

Thank you for your payment!

📞 For any queries: ${CONFIG.SUPPORT.PHONE}

Best regards,
Avilash Palace`;
}

/**
 * Generate payment request notification for owner
 * @param {string} studentName - Student's name
 * @param {string} studentPhone - Student's phone number
 * @param {number} totalAmount - Total payment amount
 * @param {string} paymentMethod - Payment method
 * @param {string} bikashNumber - Bikash number (if online)
 * @param {string} trxId - Transaction ID (if online)
 * @param {string} categoryTitle - Category title
 * @returns {string} - Formatted payment request notification for owner
 */
export function generatePaymentRequestOwnerNotification(studentName, studentPhone, totalAmount, paymentMethod, bikashNumber, trxId, categoryTitle) {
  const formattedAmount = new Intl.NumberFormat('en-IN').format(totalAmount);
  const paymentType = paymentMethod === 'online' ? 'Online Payment' : 'Cash Payment';
  
  let onlineDetails = '';
  if (paymentMethod === 'online' && bikashNumber && trxId) {
    onlineDetails = `
📱 Bikash Number: ${bikashNumber}
🆔 Transaction ID: ${trxId}`;
  }

  return `💰 New Payment Request

Dear Owner,

📋 A new payment request has been submitted:
👤 Student: ${studentName}
📱 Phone: ${studentPhone}
🏠 Category: ${categoryTitle}
💰 Amount: ৳${formattedAmount}
💳 Method: ${paymentType}
⏰ Submitted: ${new Date().toLocaleDateString('en-IN')} ${new Date().toLocaleTimeString('en-IN')}${onlineDetails}

Please review and take necessary action.

Best regards,
Avilash Palace`;
}

/**
 * Generate payment request status update message for student
 * @param {string} studentName - Student's name
 * @param {Object} requestDetails - Payment request details
 * @returns {string} - Formatted payment request status message
 */
export function generatePaymentRequestStatusMessage(studentName, requestDetails) {
  const {
    totalAmount = 0,
    rentAmount = 0,
    advanceAmount = 0,
    externalAmount = 0,
    previousDueAmount = 0,
    paymentMethod = 'on hand',
    bikashNumber = '',
    trxId = '',
    newStatus = 'pending'
  } = requestDetails;

  const formattedTotal = new Intl.NumberFormat('en-IN').format(totalAmount);
  const formattedRent = new Intl.NumberFormat('en-IN').format(rentAmount);
  const formattedAdvance = new Intl.NumberFormat('en-IN').format(advanceAmount);
  const formattedExternal = new Intl.NumberFormat('en-IN').format(externalAmount);
  const formattedPrevious = new Intl.NumberFormat('en-IN').format(previousDueAmount);

  const statusEmoji = {
    'approved': '✅',
    'rejected': '❌',
    'pending': '⏳'
  };

  const statusText = {
    'approved': 'APPROVED',
    'rejected': 'REJECTED',
    'pending': 'PENDING'
  };

  let breakdownText = '';
  if (rentAmount > 0) breakdownText += `• Rent: ৳${formattedRent}\n`;
  if (advanceAmount > 0) breakdownText += `• Advance: ৳${formattedAdvance}\n`;
  if (externalAmount > 0) breakdownText += `• External: ৳${formattedExternal}\n`;
  if (previousDueAmount > 0) breakdownText += `• Previous Due: ৳${formattedPrevious}\n`;

  let onlineDetails = '';
  if (paymentMethod === 'online' && bikashNumber && trxId) {
    onlineDetails = `
📱 Bikash Number: ${bikashNumber}
🆔 Transaction ID: ${trxId}`;
  }

  return `📋 Payment Request Status Update

Dear ${studentName},

${statusEmoji[newStatus]} Your payment request has been ${statusText[newStatus].toLowerCase()}:
💰 Total Amount: ৳${formattedTotal}
💳 Payment Method: ${paymentMethod}
📅 Updated: ${new Date().toLocaleDateString('en-IN')} ${new Date().toLocaleTimeString('en-IN')}${onlineDetails}

📋 Request Breakdown:
${breakdownText}
📊 Total Requested: ৳${formattedTotal}

${newStatus === 'approved' ? '✅ Your payment has been approved and processed successfully!' : 
 newStatus === 'rejected' ? '❌ Your payment request has been rejected. Please contact us for more information.' :
 '⏳ Your payment request is still pending review.'}

📞 For queries: ${CONFIG.SUPPORT.PHONE}

Best regards,
Avilash Palace`;
}

/**
 * Generate student leave notification message
 * @param {string} studentName - Student's name
 * @param {string} categoryTitle - Student's category title
 * @returns {string} - Formatted leave notification message
 */
export function generateStudentLeaveMessage(studentName, categoryTitle) {
  return `👋 Goodbye Notification

Dear ${studentName},

📋 Your account has been deactivated:
🏠 Category: ${categoryTitle}
📅 Date: ${new Date().toLocaleDateString('en-IN')} ${new Date().toLocaleTimeString('en-IN')}

✅ Your account status has been set to 'Leave'

📞 For any queries or to reactivate your account:
📱 Contact: ${CONFIG.SUPPORT.PHONE}
📧 Email: ${CONFIG.SUPPORT.EMAIL}

Thank you for being part of Avilash Palace!

Best regards,
Avilash Palace`;
}

/**
 * Generate complaint notification message for owner
 * @param {string} studentName - Student's name
 * @param {string} complaintTitle - Complaint title
 * @param {string} complainFor - Complaint type (mess/room)
 * @param {string} details - Complaint details
 * @param {string} studentPhone - Student's phone number
 * @returns {string} - Formatted complaint notification message for owner
 */
export function generateComplaintOwnerNotification(studentName, complaintTitle, complainFor, details, studentPhone) {
  const complainType = complainFor === 'mess' ? 'Mess' : 'Room';
  
  return `📝 New Complaint Alert

Dear Owner,

🚨 A new complaint has been submitted:
👤 Student: ${studentName}
📱 Phone: ${studentPhone}
📋 Title: ${complaintTitle}
🏠 Type: ${complainType}
📝 Details: ${details}

⏰ Submitted: ${new Date().toLocaleDateString('en-IN')} ${new Date().toLocaleTimeString('en-IN')}

Please review and take necessary action.

Best regards,
Avilash Palace`;
}

/**
 * Generate complaint status update message for student
 * @param {string} studentName - Student's name
 * @param {string} complaintTitle - Complaint title
 * @param {string} status - Complaint status
 * @param {string} complainFor - Complaint type (mess/room)
 * @returns {string} - Formatted complaint status message for student
 */
export function generateComplaintStatusUpdateMessage(studentName, complaintTitle, status, complainFor) {
  const statusEmoji = {
    'pending': '⏳',
    'checking': '🔍',
    'solved': '✅',
    'canceled': '❌'
  };
  
  const statusText = {
    'pending': 'Pending',
    'checking': 'Under Review',
    'solved': 'Resolved',
    'canceled': 'Canceled'
  };

  const complainType = complainFor === 'mess' ? 'Mess' : 'Room';
  
  return `📝 Complaint Status Update

Dear ${studentName},

${statusEmoji[status]} Your complaint has been updated:
📋 Title: ${complaintTitle}
🏠 Type: ${complainType}
🔄 Status: ${statusText[status]}
📅 Updated: ${new Date().toLocaleDateString('en-IN')} ${new Date().toLocaleTimeString('en-IN')}

${status === 'solved' ? '✅ Your issue has been resolved. Thank you for your patience!' : 
 status === 'checking' ? '🔍 We are currently investigating your complaint. We will update you soon.' :
 status === 'canceled' ? '❌ Your complaint has been canceled. Please contact us if you need assistance.' :
 '⏳ Your complaint is pending review. We will process it soon.'}

📞 For urgent matters: ${CONFIG.SUPPORT.PHONE}

Best regards,
Avilash Palace`;
}

/**
 * Generate contact notification message for owner
 * @param {string} contactName - Name of the person contacting
 * @param {string} contactPhone - Phone number of the person contacting
 * @param {string} contactMessage - Message content
 * @returns {string} - Formatted SMS message
 */
export function generateContactNotificationMessage(contactName, contactPhone, contactMessage) {
  const timestamp = new Date().toLocaleString('en-US', {
    timeZone: 'Asia/Dhaka',
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
  
  return `📞 NEW CONTACT MESSAGE

From: ${contactName}
Phone: ${contactPhone}
Time: ${timestamp}

Message:
${contactMessage}

Please respond within 24 hours.`;
}
