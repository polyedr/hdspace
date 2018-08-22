from django.conf.urls import url
from django.views.decorators.csrf import csrf_exempt

from . import views

urlpatterns = [
    url(r'^getChatBox', views.get_chat_box, name='getChatBox'),
    url(r'^guestgetChatBoxG', views.guestget_chat_box_g, name='guestgetChatBoxG'),
    url(r'^saveChatMessage', views.save_chat_message, name='saveChatMessage'),
    url(r'^guestsaveChatMessageG', views.guestsavechatmessageg, name='guestsaveChatMessageG'),
    url(r'^uploadAttachments', csrf_exempt(views.upload_attachments), name='uploadAttachments'),
    url(r'^getNewMessagesLive', views.get_new_messages_live, name='getNewMessagesLive'),
    url(r'^guestNewMessagesLiveG', views.guest_new_messages_live_g, name='guestNewMessagesLiveG'),
    url(r'^sendInviteEmail', views.send_invite_email, name='sendInviteEmail'),
    url(r'^getNewMessage', views.get_new_message, name='getNewMessage')
    # url(r'^updateMessageStatus', views.updateMessageStatus, name='updateMessageStatus')
]
