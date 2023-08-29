function deleteNotification(notification, id){
            $.ajax({
                method: 'POST',
                url: '{% url "delete_notification" %}',
                data: {
                    'notification_identifier': id,
                    'csrfmiddlewaretoken': getCookie('csrftoken'),
                },
                cache: false,
                success: function(){
                    $(notification).closest('.notification').detach();
                    notificationCounterUpdate();
                },
            })
        }