// api/send-code.js
export default async function handler(req, res) {
    if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
    
    const { email, code } = req.body;
    const RESEND_API_KEY = process.env.RESEND_API_KEY;

    try {
        const response = await fetch('https://api.resend.com/emails', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${RESEND_API_KEY}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                from: 'Domochi Club <no-reply@domochi.it>', 
                to: email,
                subject: 'Il tuo codice di verifica Domochi Club',
                html: `<div style="text-align:center; padding:20px; font-family: sans-serif;">
                        <h2 style="color: #DF4F53;">Codice di Verifica</h2>
                        <p style="color: #555;">Usa questo codice per completare la registrazione:</p>
                        <h1 style="font-size: 36px; letter-spacing: 5px; color: #333; background: #f9f9f9; padding: 15px; border-radius: 10px; display: inline-block;">${code}</h1>
                       </div>`
            })
        });
        
        const data = await response.json();
        
        if (!response.ok) {
            throw new Error(data.message || "Errore Resend");
        }
        
        res.status(200).json(data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}
