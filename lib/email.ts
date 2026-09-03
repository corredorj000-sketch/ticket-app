import { Resend } from "resend";

const resendApiKey = process.env.RESEND_API_KEY;

const resend = resendApiKey
  ? new Resend(resendApiKey)
  : null;

export async function sendWelcomeEmail({
  name,
  email,
}: {
  name: string;
  email: string;
}) {
  if (!resend) {
    console.warn(
      "RESEND_API_KEY no está configurada. No se enviará correo."
    );

    return {
      success: false,
      skipped: true,
    };
  }

  const from =
    process.env.RESEND_FROM_EMAIL ||
    "ClickTicketCo <onboarding@resend.dev>";

  const firstName =
    name.trim().split(" ")[0] || "Cliente";

  const { data, error } = await resend.emails.send({
    from,
    to: [email],
    subject: "¡Bienvenido a ClickTicketCo! 🎟️",
    html: `
      <!DOCTYPE html>
      <html lang="es">
        <head>
          <meta charset="UTF-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
          <title>Bienvenido a ClickTicketCo</title>
        </head>

        <body
          style="
            margin:0;
            padding:0;
            background:#050505;
            font-family:Arial,Helvetica,sans-serif;
            color:#ffffff;
          "
        >
          <div
            style="
              max-width:600px;
              margin:40px auto;
              padding:0 20px;
            "
          >
            <div
              style="
                background:#111111;
                border:1px solid #292929;
                border-radius:24px;
                overflow:hidden;
              "
            >
              <div
                style="
                  padding:32px;
                  text-align:center;
                  background:#000000;
                  border-bottom:1px solid #292929;
                "
              >
                <div
                  style="
                    display:inline-flex;
                    width:56px;
                    height:56px;
                    align-items:center;
                    justify-content:center;
                    border-radius:16px;
                    background:#ffffff;
                    color:#000000;
                    font-size:20px;
                    font-weight:900;
                  "
                >
                  CT
                </div>

                <h1
                  style="
                    margin:18px 0 0;
                    font-size:28px;
                    font-weight:900;
                  "
                >
                  ClickTicketCo
                </h1>
              </div>

              <div style="padding:32px;">
                <h2
                  style="
                    margin:0 0 18px;
                    font-size:24px;
                  "
                >
                  ¡Bienvenido, ${escapeHtml(firstName)}! 🎟️
                </h2>

                <p
                  style="
                    margin:0 0 18px;
                    color:#d4d4d4;
                    line-height:1.7;
                    font-size:16px;
                  "
                >
                  Tu cuenta de ClickTicketCo fue creada
                  correctamente.
                </p>

                <div
                  style="
                    margin:24px 0;
                    padding:20px;
                    background:#181818;
                    border:1px solid #333333;
                    border-radius:16px;
                  "
                >
                  <p
                    style="
                      margin:0 0 10px;
                      color:#a3a3a3;
                      font-size:13px;
                      text-transform:uppercase;
                      letter-spacing:1px;
                      font-weight:bold;
                    "
                  >
                    Correo registrado
                  </p>

                  <p
                    style="
                      margin:0;
                      color:#ffffff;
                      font-size:17px;
                      font-weight:bold;
                      word-break:break-word;
                    "
                  >
                    ${escapeHtml(email)}
                  </p>
                </div>

                <div
                  style="
                    margin:24px 0;
                    padding:20px;
                    background:#17120a;
                    border:1px solid #5a4315;
                    border-radius:16px;
                  "
                >
                  <p
                    style="
                      margin:0 0 10px;
                      color:#ffffff;
                      font-size:16px;
                      font-weight:800;
                    "
                  >
                    ⚠️ Importante para tus futuras compras
                  </p>

                  <p
                    style="
                      margin:0;
                      color:#d4d4d4;
                      line-height:1.7;
                      font-size:14px;
                    "
                  >
                    Te recomendamos registrarte con el mismo
                    correo electrónico que tienes asociado a
                    TuBoleta, Ticketmaster u otra plataforma
                    oficial donde recibirás tus entradas.
                  </p>

                  <p
                    style="
                      margin:14px 0 0;
                      color:#d4d4d4;
                      line-height:1.7;
                      font-size:14px;
                    "
                  >
                    Este correo será utilizado para realizar
                    el envío o transferencia de tu boletería.
                  </p>
                </div>

                <p
                  style="
                    margin:24px 0 0;
                    color:#a3a3a3;
                    line-height:1.7;
                    font-size:14px;
                  "
                >
                  Cuando realices una compra, nuestro equipo
                  se pondrá en contacto contigo para confirmar
                  el pago y coordinar la entrega de tu entrada.
                </p>

                <div
                  style="
                    margin-top:30px;
                    padding-top:24px;
                    border-top:1px solid #292929;
                  "
                >
                  <p
                    style="
                      margin:0;
                      color:#ffffff;
                      font-weight:bold;
                    "
                  >
                    Equipo ClickTicketCo
                  </p>

                  <p
                    style="
                      margin:8px 0 0;
                      color:#737373;
                      font-size:13px;
                    "
                  >
                    Compra tus entradas con confianza.
                  </p>
                </div>
              </div>
            </div>

            <p
              style="
                text-align:center;
                margin:20px 0;
                color:#525252;
                font-size:12px;
              "
            >
              Este correo fue enviado automáticamente por ClickTicketCo.
            </p>
          </div>
        </body>
      </html>
    `,
  });

  if (error) {
    console.error(
      "WELCOME EMAIL ERROR:",
      error
    );

    return {
      success: false,
      skipped: false,
      error,
    };
  }

  return {
    success: true,
    skipped: false,
    data,
  };
}

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}