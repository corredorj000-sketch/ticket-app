import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

const FROM_EMAIL =
  process.env.RESEND_FROM_EMAIL ||
  "ClickTicketCo <onboarding@resend.dev>";

const APP_URL =
  process.env.NEXTAUTH_URL || "http://localhost:3000";

type WelcomeEmailParams = {
  name: string;
  email: string;
};

export async function sendWelcomeEmail({
  name,
  email,
}: WelcomeEmailParams) {
  const safeName = name?.trim() || "Cliente";

  try {
    const { error } = await resend.emails.send({
      from: FROM_EMAIL,
      to: email,
      subject: "🎟️ Bienvenido a ClickTicketCo",
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
    background-color:#f4f4f5;
    font-family:Arial,Helvetica,sans-serif;
    color:#18181b;
  "
>

<table
  width="100%"
  cellpadding="0"
  cellspacing="0"
  border="0"
  style="background-color:#f4f4f5;padding:40px 15px;"
>
  <tr>
    <td align="center">

      <table
        width="100%"
        cellpadding="0"
        cellspacing="0"
        border="0"
        style="
          max-width:620px;
          background:#ffffff;
          border-radius:18px;
          overflow:hidden;
          box-shadow:0 4px 20px rgba(0,0,0,0.08);
        "
      >

        <!-- HEADER -->

        <tr>
          <td
            style="
              background:#09090b;
              padding:32px 35px;
              text-align:center;
            "
          >
            <div
              style="
                font-size:28px;
                font-weight:800;
                letter-spacing:-1px;
                color:#ffffff;
              "
            >
              Click<span style="color:#a78bfa;">Ticket</span>Co
            </div>

            <div
              style="
                margin-top:8px;
                font-size:13px;
                color:#a1a1aa;
                letter-spacing:0.5px;
              "
            >
              TU EXPERIENCIA. TU EVENTO. TU ENTRADA.
            </div>
          </td>
        </tr>


        <!-- CONTENT -->

        <tr>
          <td style="padding:42px 40px 30px 40px;">

            <div
              style="
                font-size:13px;
                font-weight:700;
                color:#7c3aed;
                text-transform:uppercase;
                letter-spacing:1px;
                margin-bottom:12px;
              "
            >
              Cuenta creada correctamente
            </div>

            <h1
              style="
                margin:0 0 18px 0;
                font-size:32px;
                line-height:1.2;
                color:#18181b;
              "
            >
              ¡Bienvenido, ${safeName}! 👋
            </h1>

            <p
              style="
                margin:0 0 20px 0;
                font-size:16px;
                line-height:1.7;
                color:#52525b;
              "
            >
              Gracias por registrarte en
              <strong style="color:#18181b;">ClickTicketCo</strong>.
              Tu cuenta ya está lista y podrás comenzar a gestionar
              tus compras de entradas para tus próximos eventos.
            </p>


            <!-- IMPORTANT NOTICE -->

            <table
              width="100%"
              cellpadding="0"
              cellspacing="0"
              border="0"
              style="
                margin:28px 0;
                background:#faf5ff;
                border:1px solid #e9d5ff;
                border-radius:14px;
              "
            >
              <tr>
                <td style="padding:22px 24px;">

                  <div
                    style="
                      font-size:16px;
                      font-weight:700;
                      color:#581c87;
                      margin-bottom:10px;
                    "
                  >
                    ⚠️ Importante sobre tu correo
                  </div>

                  <p
                    style="
                      margin:0;
                      font-size:14px;
                      line-height:1.7;
                      color:#52525b;
                    "
                  >
                    El correo electrónico con el que te registraste será
                    utilizado para nuestras comunicaciones y, cuando
                    corresponda, para realizar la transferencia de tus
                    entradas.
                  </p>

                  <p
                    style="
                      margin:12px 0 0 0;
                      font-size:14px;
                      line-height:1.7;
                      color:#52525b;
                    "
                  >
                    Por este motivo, te recomendamos utilizar el
                    <strong>
                      mismo correo electrónico que tienes registrado
                      en la plataforma oficial del evento
                    </strong>,
                    como TuBoleta o Ticketmaster.
                  </p>

                </td>
              </tr>
            </table>


            <!-- HOW IT WORKS -->

            <h2
              style="
                margin:30px 0 18px 0;
                font-size:20px;
                color:#18181b;
              "
            >
              ¿Cómo funciona ClickTicketCo?
            </h2>

            <table
              width="100%"
              cellpadding="0"
              cellspacing="0"
              border="0"
            >

              <tr>
                <td
                  width="44"
                  valign="top"
                  style="padding-bottom:18px;"
                >
                  <div
                    style="
                      width:34px;
                      height:34px;
                      line-height:34px;
                      text-align:center;
                      background:#18181b;
                      color:#ffffff;
                      border-radius:50%;
                      font-weight:700;
                    "
                  >
                    1
                  </div>
                </td>

                <td
                  valign="top"
                  style="
                    padding:2px 0 18px 10px;
                    font-size:14px;
                    line-height:1.6;
                    color:#52525b;
                  "
                >
                  <strong style="color:#18181b;">
                    Selecciona tus entradas
                  </strong>
                  <br />
                  Elige el evento, la zona y la cantidad de entradas
                  disponibles.
                </td>
              </tr>


              <tr>
                <td
                  width="44"
                  valign="top"
                  style="padding-bottom:18px;"
                >
                  <div
                    style="
                      width:34px;
                      height:34px;
                      line-height:34px;
                      text-align:center;
                      background:#18181b;
                      color:#ffffff;
                      border-radius:50%;
                      font-weight:700;
                    "
                  >
                    2
                  </div>
                </td>

                <td
                  valign="top"
                  style="
                    padding:2px 0 18px 10px;
                    font-size:14px;
                    line-height:1.6;
                    color:#52525b;
                  "
                >
                  <strong style="color:#18181b;">
                    Realiza tu pago
                  </strong>
                  <br />
                  Una vez confirmado el pago, comenzaremos a gestionar
                  tu pedido.
                </td>
              </tr>


              <tr>
                <td
                  width="44"
                  valign="top"
                >
                  <div
                    style="
                      width:34px;
                      height:34px;
                      line-height:34px;
                      text-align:center;
                      background:#18181b;
                      color:#ffffff;
                      border-radius:50%;
                      font-weight:700;
                    "
                  >
                    3
                  </div>
                </td>

                <td
                  valign="top"
                  style="
                    padding:2px 0 0 10px;
                    font-size:14px;
                    line-height:1.6;
                    color:#52525b;
                  "
                >
                  <strong style="color:#18181b;">
                    Recibe tu entrada
                  </strong>
                  <br />
                  Nuestro equipo gestionará manualmente la transferencia
                  al correo electrónico registrado en tu cuenta.
                </td>
              </tr>

            </table>


            <!-- SECURITY -->

            <table
              width="100%"
              cellpadding="0"
              cellspacing="0"
              border="0"
              style="
                margin-top:32px;
                background:#f4f4f5;
                border-radius:14px;
              "
            >
              <tr>
                <td style="padding:22px 24px;">

                  <div
                    style="
                      font-size:15px;
                      font-weight:700;
                      color:#18181b;
                      margin-bottom:8px;
                    "
                  >
                    🔐 Tu seguridad es importante
                  </div>

                  <p
                    style="
                      margin:0;
                      font-size:14px;
                      line-height:1.7;
                      color:#52525b;
                    "
                  >
                    ClickTicketCo actúa como intermediario en el proceso
                    de compra y gestión de tus entradas. Nunca te
                    solicitaremos que compartas tu contraseña de
                    TuBoleta, Ticketmaster u otra plataforma.
                  </p>

                </td>
              </tr>
            </table>


            <!-- BUTTON -->

            <div
              style="
                text-align:center;
                margin:35px 0 10px 0;
              "
            >
              <a
                href="${APP_URL}"
                style="
                  display:inline-block;
                  background:#18181b;
                  color:#ffffff;
                  text-decoration:none;
                  padding:15px 28px;
                  border-radius:10px;
                  font-size:15px;
                  font-weight:700;
                "
              >
                Explorar eventos
              </a>
            </div>

          </td>
        </tr>


        <!-- FOOTER -->

        <tr>
          <td
            style="
              background:#fafafa;
              border-top:1px solid #e4e4e7;
              padding:28px 35px;
              text-align:center;
            "
          >

            <div
              style="
                font-size:17px;
                font-weight:800;
                color:#18181b;
                margin-bottom:8px;
              "
            >
              Click<span style="color:#7c3aed;">Ticket</span>Co
            </div>

            <p
              style="
                margin:0 0 12px 0;
                font-size:12px;
                line-height:1.6;
                color:#71717a;
              "
            >
              Tu aliado para vivir los mejores eventos.
            </p>

            <p
              style="
                margin:0;
                font-size:11px;
                line-height:1.6;
                color:#a1a1aa;
              "
            >
              Este correo fue enviado automáticamente porque se creó
              una cuenta en ClickTicketCo.
              <br />
              Si no realizaste este registro, puedes ignorar este mensaje.
            </p>

          </td>
        </tr>

      </table>

    </td>
  </tr>
</table>

</body>
</html>
      `,
    });

    if (error) {
      console.error("WELCOME EMAIL ERROR:", error);
      return;
    }

    console.log("WELCOME EMAIL SENT:", email);
  } catch (error) {
    console.error("WELCOME EMAIL EXCEPTION:", error);
  }
}