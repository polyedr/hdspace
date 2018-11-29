    //
    //
    // //Right Side Bar
    // function increaseSidebar() {
    //     document.getElementById('right-sidebar').style = 'width:50%';
    //     document.getElementById('mid-sidebar').style.display = 'none';
    //     document.getElementById('full-sidebar').style.display = '';
    // }
    //
    // function fullSidebar() {
    //     document.getElementById('right-sidebar').style = 'width:88.3%; z-index: 10000;';
    //     document.getElementById('full-sidebar').style.display = 'none';
    //     document.getElementById('mini-sidebar').style.display = '';
    // }
    //
    // function minimizeSidebar() {
    //     document.getElementById('right-sidebar').style = 'width:22%';
    //     document.getElementById('mini-sidebar').style.display = 'none';
    //     document.getElementById('mid-sidebar').style.display = '';
    // }
    //
    // function openMessageG(element) {
    //     document.getElementById('chat-title').style.display = 'none';
    //     document.getElementById('chatpanelG').style.display = 'none';
    //     document.getElementById('message-search').style.display = 'none';
    //     document.getElementById('job-tab').style.display = 'none';
    //     document.getElementById('source-tab').style.display = 'none';
    //     document.getElementById('messagepanelG').style.display = '';
    //     document.getElementById('name-message').innerHTML = element.children[0].children[1].children[0].children[0].innerHTML;
    // }
    //
    // function openInviteMessage() {
    //     document.getElementById('chat-title').style.display = 'none';
    //     document.getElementById('chatpanel').style.display = 'none';
    //     document.getElementById('message-search').style.display = 'none';
    //     document.getElementById('job-tab').style.display = 'none';
    //     document.getElementById('source-tab').style.display = 'none';
    //     document.getElementById('invitepanel').style.display = '';
    // }
    //
    // function openAdeviMessage() {
    //     document.getElementById('chat-title').style.display = 'none';
    //     document.getElementById('chatpanel').style.display = 'none';
    //     document.getElementById('message-search').style.display = 'none';
    //     document.getElementById('job-tab').style.display = 'none';
    //     document.getElementById('source-tab').style.display = 'none';
    //     document.getElementById('adevipanel').style.display = '';
    // }
    //
    // function closeMessageG() {
    //     document.getElementById('chat-title').style.display = '';
    //     document.getElementById('chatpanelG').style.display = '';
    //     document.getElementById('message-search').style.display = '';
    //     document.getElementById('job-tab').style.display = '';
    //     document.getElementById('messagepanelG').style.display = 'none';
    //     document.getElementById('invitepanel').style.display = 'none';
    //     document.getElementById('adevipanel').style.display = 'none';
    // }
    //
    // // function sendMessageG() {
    // //     if (document.getElementById('new-messageG').value != '') {
    // //         var message = "<div class=\"media task\" style=\"padding-right:15px;padding-left:0;\">" +
    // //                       "<a class=\"testTask\" style=\"width:12px;color:#c1c1c1;display:table-cell;\" onclick=\"selectMessage(this)\"><i class=\"fa fa-check\" style=\"color:inherit\"></i></a>" +
    // //                       "<div class=\"media-body\">" +
    // //                       "<div class=\"panel-default\">" +
    // //                       "<div class=\"panel-body bg-primary text-white b-r-a-3\">" +
    // //                       "<span>" + document.getElementById('new-messageG').value +"</span>" +
    // //                       "</div>" +
    // //                       "</div>" +
    // //                       "<h6 class=\"m-t-1\"><span>Violette Lehner</span>   <small><span>09:42</span></small></h6>" +
    // //                       "</div>" +
    // //                       "<div class=\"media-right\">" +
    // //                       "<div class=\"avatar avatar-image avatar-sm loaded\">" +
    // //                       "<img class=\"media-object img-circle\" src=\"https://s3.amazonaws.com/uifaces/faces/twitter/woodydotmx/128.jpg\" alt=\"Avatar\">" +
    // //                       "<i class=\"avatar-status avatar-status-bottom bg-success b-brand-gray-darker\"></i>" +
    // //                       "</div>" +
    // //                       "</div>" +
    // //                       "</div>";
    // //         document.getElementById('body-messageG').innerHTML += message;
    // //         document.getElementById('new-messageG').value = '';
    // //     }
    // // }
    //
    // function sendMessageG(messageHtmlResponse=false) {
    //     if (document.getElementById('new-messageG').value != '' || document.getElementById('attachments').value != '') {
    //         var message = "<div class=\"media task\" style=\"padding-right:15px;padding-left:0;\">" +
    //                       "<a class=\"testTask\" style=\"width:12px;color:#c1c1c1;display:table-cell;\" onclick=\"selectMessage(this)\"><i class=\"fa fa-check\" style=\"color:inherit\"></i></a>" +
    //                       "<div class=\"media-body\">" +
    //                       "<div class=\"panel-default\">" +
    //                       "<div class=\"panel-body bg-primary text-white b-r-a-3\">" +
    //                       "<span>" + document.getElementById('attachments').value +"</span>" +
    //                       "<span>" + document.getElementById('new-messageG').value +"</span>" +
    //                       "</div>" +
    //                       "</div>" +
    //                       "<h6 class=\"m-t-1\"><span>Violette Lehner</span>   <small><span>09:42</span></small></h6>" +
    //                       "</div>" +
    //                       "<div class=\"media-right\">" +
    //                       "<div class=\"avatar avatar-image avatar-sm loaded\">" +
    //                       "<img class=\"media-object img-circle\" src=\"https://s3.amazonaws.com/uifaces/faces/twitter/woodydotmx/128.jpg\" alt=\"Avatar\">" +
    //                       "<i class=\"avatar-status avatar-status-bottom bg-success b-brand-gray-darker\"></i>" +
    //                       "</div>" +
    //                       "</div>" +
    //                       "</div>";
    //         if(messageHtmlResponse){
    //             message = messageHtmlResponse;
    //         }
    //         document.getElementById('body-messageG').innerHTML += message;
    //         document.getElementById('new-messageG').value = '';
    //         document.getElementById('attachments').value = '';
    //     }
    // }
    //
    // function selectMessage(element) {
    //     var x = element.style.visibility;
    //     var y = 0;
    //     var children = document.getElementById('body-messageG').children;
    //     for (var i = 0; i < children.length; i++) {
    //         if ($(children[i]).hasClass('selected')) {
    //             y = y + 1;
    //         }
    //     }
    //     if (x == 'visible' && (y == 0 || y == 1)) {
    //         element.style = 'width:12px;color:c1c1c1;display:table-cell;';
    //         document.getElementById('new-task').style.display = 'none';
    //         document.getElementById('edit-task').style.display = 'none';
    //         document.getElementById('body-messageG').style = 'height:89%;padding:0;overflow:auto;';
    //         var parent = element.parentNode;
    //         $(parent).removeClass('selected');
    //     }
    //     else if (x == 'visible' && y > 1) {
    //         element.style = 'width:12px;color:c1c1c1;display:table-cell;';
    //         var parent = element.parentNode;
    //         $(parent).removeClass('selected');
    //     }
    //     else {
    //         element.style = 'width:12px;color:#18a689;display:table-cell;visibility:visible';
    //         document.getElementById('new-task').style.display = '';
    //         document.getElementById('edit-task').style.display = '';
    //         document.getElementById('body-messageG').style = 'height:85%;padding:0;overflow:auto;';
    //         var parent = element.parentNode;
    //         $(parent).addClass('selected');
    //     }
    // }
    //
    //
    // function searchChat() {
    //     var regex = new RegExp("" + document.getElementById('search-input-chat').value, "i");
    //     var child = document.getElementById('chat-list').children;
    //     for (var i = 1; i < child.length; i++) {
    //         if (i == 5 || i == 9 || i == 13 || i == 17) {
    //             child[i].style.display = '';
    //         }
    //         else {
    //             var name = child[i].children[0].children[0].children[1].children[0].children[0].innerHTML;
    //             if (regex.test(name)) {
    //                 child[i].style.display = '';
    //             }
    //             else {
    //                 child[i].style.display = 'none';
    //             }
    //         }
    //     }
    // }
    //
    // function openProjectG() {
    //     document.getElementById('project-listG').style.display = 'none';
    //     document.getElementById('project-detailG').style.display = '';
    //     document.getElementById('message-search-projectG').style.display = 'none';
    // }
    //
    // function closeProjectG() {
    //     document.getElementById('project-listG').style.display = '';
    //     document.getElementById('project-detailG').style.display = 'none';
    //     document.getElementById('message-search-projectG').style.display = '';
    // }
    //
    // function editTaskG(element) {
    //     var parent = element.parentNode;
    //     var children = parent.children;
    //     children[2].style.display = 'none';
    //     children[3].style.display = 'none';
    //     children[4].style.display = '';
    //     children[5].style.display = '';
    //     children[4].value = children[3].innerHTML;
    // }
    //
    // function confirmEditG(element) {
    //     var parent = element.parentNode;
    //     var children = parent.children;
    //     children[2].style.display = 'unset';
    //     children[3].style.display = 'inline-block';
    //     children[4].style.display = 'none';
    //     children[5].style.display = 'none';
    //     children[3].innerHTML = children[4].value;
    // }
    //
    // function newTaskG() {
    //     var task = "<li id=\"task-creation\" class=\"edit-task\" style=\"padding-left:0;\"><input id=\"new-value\" type=\"text\" style=\"width:90%\"><button class=\"btn\" style=\"padding:0 6px\" onclick=\"confirmNewTaskG()\">Ok</button></li>";
    //     document.getElementById('task-list').innerHTML += task;
    // }
    //
    // function confirmNewTaskG() {
    //     var confirm = "<span class=\"col-xs-3\">Pending...</span>" +
    //                   "<a class=\"task-edit\" href=\"#\" onclick=\"editTaskG(this)\" style=\"display:unset;margin-left:-5px;float:left;\"><i class=\"fa fa-pencil\"></i> </a>" +
    //                   "<a href=\"#\" class=\"check-link\" onclick=\"completeTaskG(this)\" style=\"display:unset;margin-left:5px;float:left;\"><i class=\"fa fa-square-o\"></i> </a>" +
    //                   "<span class=\"m-l-xs\" style=\"display:inline-block;max-width:150px;\">" + document.getElementById('new-value').value + "</span>" +
    //                   "<input id=\"edit-input\" type=\"text\" style=\"display:none\">" +
    //                   "<button id=\"edit-confirm\" class=\"btn\" style=\"display:none;padding:0 6px\" onclick=\"confirmEditG(this)\">Ok</button>" +
    //                   "<span style=\"float:right;padding-right:15px\"><i class=\"fa fa-clock-o\" style=\"color:5a5a5a;\"></i>08:20am</span>";
    //     document.getElementById('task-creation').innerHTML = confirm;
    //     document.getElementById('task-creation').id = '';
    // }
    //
    // function completeTaskG(element) {
    //     $(element.firstChild).toggleClass('fa-square-o').toggleClass('fa-check-square');
    //     $(element).next('span').toggleClass('todo-completed');
    // }
    //
    //
    // function addChatTaskG() {
    //     var children = document.getElementById('body-messageG').children;
    //     for (var i = 0; i < children.length; i++) {
    //         if ($(children[i]).hasClass('selected')) {
    //             var test = children[i].children[1].children[0].children[0].children;
    //             var splitted = test[0].innerHTML.split('. ');
    //             if (splitted.length > 1 && confirm('Do you want to split this message in multiple tasks ?')) {
    //                 for (var y = 0; y < splitted.length; y++) {
    //                     if (splitted[y] != '') {
    //                         var message = "<li id=\"task-creation\" class=\"edit-task\" style=\"padding-left:0;\"><input id=\"new-value\" type=\"text\" value=\"" + splitted[y] + "\" style=\"width:90%\"><button class=\"btn\" style=\"padding:0 6px\" onclick=\"confirmNewTaskG()\">Ok</button></li>";
    //                         document.getElementById('task-list').innerHTML += message;
    //                     }
    //                 }
    //             }
    //             else {
    //                 var message = "<li id=\"task-creation\" class=\"edit-task\" style=\"padding-left:0;\"><input id=\"new-value\" type=\"text\" value=\"" + test[0].innerHTML + "\" style=\"width:90%\"><button class=\"btn\" style=\"padding:0 6px\" onclick=\"confirmNewTaskG()\">Ok</button></li>";
    //                 document.getElementById('task-list').innerHTML += message;
    //             }
    //         }
    //     }
    //     document.getElementById('add-chat-task').style.display = 'none';
    // }
    //
    // /* ---------------- End ---------------- */
    //
    //
    //
    //
    //
    //
    //
    //
    //
