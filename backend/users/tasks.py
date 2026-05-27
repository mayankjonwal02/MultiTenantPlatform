from celery import shared_task
import logging

from users.services.email_service import (
    send_password_reset_email,
    send_verification_email,
    send_invitation_email,
    send_ownership_transfer_email,
)

logger = logging.getLogger(__name__)


def enqueue_task(task, *args, **kwargs):
    try:
        task.delay(*args, **kwargs)
        return True
    except Exception as e:
        logger.warning("Failed to enqueue task %s, falling back to synchronous: %s", task.name, str(e))
        try:
            task(*args, **kwargs)
            return True
        except Exception as sync_error:
            logger.error("Synchronous execution also failed for %s: %s", task.name, str(sync_error))
            return False


@shared_task
def send_password_reset_email_task(email, user_name, reset_link):
    """Async task to send password reset email"""
    return send_password_reset_email(email, user_name, reset_link)


@shared_task
def send_verification_email_task(email, user_name, verification_link):
    """Async task to send email verification"""
    return send_verification_email(email, user_name, verification_link)


@shared_task
def send_invitation_email_task(email, inviter_name, organization_name, invite_link):
    """Async task to send invitation email"""
    return send_invitation_email(email, inviter_name, organization_name, invite_link)


@shared_task
def send_ownership_transfer_email_task(new_owner_email, new_owner_name, org_name, previous_owner_name):
    """Async task to notify new owner of ownership transfer"""
    return send_ownership_transfer_email(new_owner_email, new_owner_name, org_name, previous_owner_name)
