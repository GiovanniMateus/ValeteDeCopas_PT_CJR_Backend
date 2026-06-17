import { Injectable } from '@nestjs/common';
import { Resend } from 'resend';

@Injectable()
export class EmailService {
  private resend: Resend;

  constructor() {
    this.resend = new Resend(process.env.RESEND_API_KEY);
  }

  async enviarEmailRecuperacaoSenha(email: string, token: string) {
    const link = `${process.env.FRONTEND_URL}/redefinir-senha?token=${token}`;


    await this.resend.emails.send({
      // Enquanto o domínio não estiver verificado no Resend vai usa esse remetente de teste:

      from: 'onboarding@resend.dev',
      to: email,
      subject: 'Recuperação de senha',
      html: `
        <div style="font-family: sans-serif; max-width: 480px; margin: 0 auto;">
          <h2>Recuperação de senha</h2>
          <p>Recebemos uma solicitação para redefinir sua senha no Stock.io.</p>
          <p>Clique no botão abaixo para criar uma nova senha:</p>
          <a href="${link}"
             style="display:inline-block; background:#7C3AED; color:#fff;
                    padding:12px 24px; border-radius:8px; text-decoration:none;
                    margin: 16px 0;">
            Redefinir minha senha
          </a>
          <p style="color:#666; font-size:13px;">
            Se você não solicitou isso, pode ignorar este email.

        
          </p>
        </div>
      `,
    });
  }
}