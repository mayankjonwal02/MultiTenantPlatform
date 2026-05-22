import logging
from django.core.mail import send_mail
from django.template.loader import render_to_string
from django.utils.html import strip_tags
from django.conf import settings

logger = logging.getLogger(__name__)


def send_password_reset_email(email, user_name, reset_link):
    """
    Send password reset email to user

    Args:
        email: User's email address
        user_name: User's name for greeting
        reset_link: Link to reset password page
    """
    subject = "Password Reset Request"

    html_message = f"""
    <html>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
            <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
                <h2>Password Reset Request</h2>
                <p>Hello {user_name},</p>
                <p>We received a request to reset your password. Click the link below to create a new password:</p>
                <p><a href="{reset_link}" style="background-color: #007bff; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block;">Reset Password</a></p>
                <p>Or copy and paste this link in your browser:</p>
                <p><code>{reset_link}</code></p>
                <p>If you did not request a password reset, please ignore this email.</p>
                <p>Best regards,<br>The Team</p>
            </div>
        </body>
    </html>
    """

    plain_message = f"""
    Hello {user_name},

    We received a request to reset your password. Click the link below to create a new password:

    {reset_link}

    If you did not request a password reset, please ignore this email.

    Best regards,
    The Team
    """

    try:
        send_mail(
            subject=subject,
            message=plain_message,
            from_email=settings.DEFAULT_FROM_EMAIL,
            recipient_list=[email],
            html_message=html_message,
            fail_silently=False,
        )
        logger.info(f"Password reset email sent to {email}")
        return True
    except Exception as e:
        logger.error(f"Error sending password reset email to {email}: {str(e)}")
        return False


def send_verification_email(email, user_name, verification_link):
    """
    Send email verification email to user

    Args:
        email: User's email address
        user_name: User's name for greeting
        verification_link: Link to verify email
    """
    subject = "Verify Your Email Address"

    html_message = f"""
    <html>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
            <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
                <h2>Email Verification</h2>
                <p>Hello {user_name},</p>
                <p>Thank you for signing up! Please verify your email address by clicking the link below:</p>
                <p><a href="{verification_link}" style="background-color: #28a745; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block;">Verify Email</a></p>
                <p>Or copy and paste this link in your browser:</p>
                <p><code>{verification_link}</code></p>
                <p>If you did not create this account, please ignore this email.</p>
                <p>Best regards,<br>The Team</p>
            </div>
        </body>
    </html>
    """

    plain_message = f"""
    Hello {user_name},

    Thank you for signing up! Please verify your email address by clicking the link below:

    {verification_link}

    If you did not create this account, please ignore this email.

    Best regards,
    The Team
    """

    try:
        send_mail(
            subject=subject,
            message=plain_message,
            from_email=settings.DEFAULT_FROM_EMAIL,
            recipient_list=[email],
            html_message=html_message,
            fail_silently=False,
        )
        logger.info(f"Verification email sent to {email}")
        return True
    except Exception as e:
        logger.error(f"Error sending verification email to {email}: {str(e)}")
        return False


def send_invitation_email(email, inviter_name, organization_name, invite_link):
    """
    Send invitation email to user

    Args:
        email: Recipient's email address
        inviter_name: Name of the person sending the invite
        organization_name: Name of the organization
        invite_link: Link to accept invitation
    """
    subject = f"You've been invited to join {organization_name}"

    html_message = f"""
    <html>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
            <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
                <h2>You're Invited!</h2>
                <p>Hello,</p>
                <p><strong>{inviter_name}</strong> has invited you to join <strong>{organization_name}</strong>.</p>
                <p>Click the link below to accept the invitation:</p>
                <p><a href="{invite_link}" style="background-color: #007bff; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block;">Accept Invitation</a></p>
                <p>Or copy and paste this link in your browser:</p>
                <p><code>{invite_link}</code></p>
                <p>If you don't recognize {inviter_name}, you can safely ignore this email.</p>
                <p>Best regards,<br>The Team</p>
            </div>
        </body>
    </html>
    """

    plain_message = f"""
    Hello,

    {inviter_name} has invited you to join {organization_name}.

    Click the link below to accept the invitation:

    {invite_link}

    If you don't recognize {inviter_name}, you can safely ignore this email.

    Best regards,
    The Team
    """

    try:
        send_mail(
            subject=subject,
            message=plain_message,
            from_email=settings.DEFAULT_FROM_EMAIL,
            recipient_list=[email],
            html_message=html_message,
            fail_silently=False,
        )
        logger.info(f"Invitation email sent to {email}")
        return True
    except Exception as e:
        logger.error(f"Error sending invitation email to {email}: {str(e)}")
        return False
