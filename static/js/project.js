(function () {
	"use strict";

	// messaging
	var last_pk = 0;
	var workflowScreenId = "";
	var screenStatus = "";
	var currentTaskId = 0;
	var authorId = 0;
	var taskMessages = {};
	var statusColor = {
		on_hold: "backgroundGreen",
		in_progress: "backgroundBlue",
		review: "backgroundRed",
		approved: "backgroundOrange"
	};

	// toggleErrors([".validate_error"], false);

	// $(".js-upload-photos").click(function () {
	// 	$("#fileupload").click();
	// });
    //
	// if ($("#fileupload").fileupload) {
	// 	$("#fileupload").fileupload({
	// 		dataType: "json",
	// 		sequentialUploads: true,
	// 		start: function (e) {
	// 			$(".progress").removeClass("hide");
	// 		},
	// 		stop: function (e) {
	// 			$(".progress").addClass("hide");
	// 		},
	// 		progressall: function (e, data) {
	// 			var progress = parseInt((data.loaded / data.total) * 100, 10);
	// 			var strProgress = progress + "%";
	// 			$(".progress-bar").css({ width: strProgress });
	// 			$(".progress-bar").text(strProgress);
	// 		},
	// 		done: function (e, data) {
	// 			var response = data.result;
	// 			if (response.is_valid) {
	// 				var $eventBox = $("#screen-image-content").clone(true, true);
	// 				$eventBox.removeAttr("id");
	// 				$eventBox.removeClass("hide");
	// 				$eventBox.find("img").attr("src", response.url);
	// 				$eventBox.find("img").attr("data-preview_url", response.preview_url);
	// 				$eventBox.find("img").attr("data-screen-save-url", response.save_url);
	// 				$eventBox.find("img").attr("data-event_url", response.event_url);
	// 				$eventBox.find("img").attr("screen-id", response.pk);
	// 				$eventBox.find("a").attr("data-screen-id", response.pk);
	// 				// $eventBox.find('a:nth-child(2)').attr('href', response.edit_screen_url);
	// 				$eventBox
	// 					.find("a:nth-child(2)")
	// 					.attr("data-event_url", response.event_url);
	// 				$eventBox
	// 					.find("a:nth-child(2)")
	// 					.attr("data-get-screen-url", response.save_url);
	// 				$eventBox.find(".message-avatar-wrap").addClass("not-selected-msg");
	// 				$(".image-list-body").append($eventBox);
	// 				$(".progress").addClass("hide");
	// 				$(".screen_actions").show();
	// 				showNotifications("success", response.msg);
	// 			} else {
	// 				showNotifications("error", response.msg);
	// 			}
	// 		}
	// 	});
	// }

	$("#addTask").on("click", function (e) {
		$("#editTaskButton").hide();
	});

	$("#addTaskButton").on("click", function (e) {
		e.preventDefault();
		var url = $(this).data("url");
		if (currentTaskId) {
			var url = $(this).data("sub-url");
		}
		var projectId = $(this).data("project_id");
		var title = $("#id_title").val();
		var description = $("#id_description").val();
		var owner = $("#id_owner").val();

		$.ajax({
			url: url,
			method: "POST",
			data: {
				csrfmiddlewaretoken: window.csrftoken,
				title: title,
				description: description,
				owner: owner,
				projectId: projectId,
				taskId: currentTaskId
			},
			success: function (response) {
				var $activityItem = $("#projectActivityItem").clone(true, true);
				$activityItem.removeClass("hide");
				$activityItem.find("h4").text(response.title);
				$activityItem.find("span").text(response.description);
				$activityItem
					.find("div span")
					.text(moment(response.created).format("ll"));
				$activityItem.attr("data-task-id", response.id);
				$activityItem
					.find("ul li[data-member-id=" + response.owner + "]")
					.addClass("active");
				$(".addTaskList").append($activityItem);
				$("#addTaskModal").modal("hide");
				showNotifications("success", response.msg);
				$("#addChatTask").hide();
				$("#addTaskButton").hide();
				$(".add-to-task").prop("checked", false);
				$(".modal-backdrop").remove();
			},
			error: function (xhr, status, error) {
				var response = jQuery.parseJSON(xhr.responseText);
				showNotifications("error", response.msg);
			}
		});
	});

	$("#editTaskButton").on("click", function (e) {
		e.preventDefault();
		var url = $(this).data("url");
		var title = $("#id_title").val();
		var description = $("#id_description").val();
		var owner = $("#id_owner").val();
		var projectId = $(this).data("project_id");
		$("#editTaskButton").hide();

		$.ajax({
			url: url,
			method: "POST",
			data: {
				csrfmiddlewaretoken: window.csrftoken,
				title: title,
				description: description,
				owner: owner,
				taskId: currentTaskId,
				projectId: projectId
			},
			success: function (response) {
				var $editTaskItem = $("ul li[data-task-id=" + currentTaskId + "]");
				$editTaskItem.find("h4").text(title);
				$editTaskItem.find(".task-description").text(description);
				$("#addTaskModal").modal("hide");
				$editTaskItem.find("ul li").removeClass("active");
				$editTaskItem
					.find("ul li[data-member-id=" + owner + "]")
					.addClass("active");
				showNotifications("success", response.msg);
			},
			error: function (xhr, status, error) {
				var response = jQuery.parseJSON(xhr.responseText);
				showNotifications("error", response.msg);
			}
		});
	});

	$("#addTaskModal").on("hidden.bs.modal", function () {
		$("#addTaskButton").show();
		$("#editTaskButton").hide();
		$("#addTaskForm")[0].reset();
		currentTaskId = "";
	});

	$(document).on("click", ".deleteButton", function () {
		var taskId = $(this)
			.closest(".task-list")
			.attr("data-task-id");
		var url = $(".addTaskList").data("task-delete-url");
		var $assign = $(this);
		$.ajax({
			url: url,
			method: "POST",
			data: {
				csrfmiddlewaretoken: window.csrftoken,
				taskId: taskId
			},
			success: function (response) {
				$assign.closest(".task-list").remove();
				showNotifications("success", response.msg);
			}
		});
	});

	$(document).on("click", ".subButton", function () {
		var $closest = $(this).closest(".task-list");
		currentTaskId = $closest.attr("data-task-id");
		toggleErrors([".validate_error"], false);
		$("#addTaskModal").modal();
		$("#addTaskButton").show();
		$("#editTaskButton").hide();
	});

	$(document).on("click", ".editButton", function () {
		var $closest = $(this).closest(".task-list");
		currentTaskId = $closest.attr("data-task-id");
		toggleErrors([".validate_error"], false);
		$("#addTaskModal").modal();
		$("#id_title").val($closest.find("h4").text());
		$("#id_description").val($closest.find(".task-description").text());
		var member = $closest.find(".active").attr("data-member-id");
		$("#id_owner")
			.find("option[value=" + member + "]")
			.attr("selected", "selected");
		$("#editTaskButton").show();
	});

	$(document).on("click", ".assigneeTask li", function () {
		var url = $(".addTaskList").data("assign-url");
		var memberId = $(this).attr("data-member-id");
		var taskId = $(this)
			.closest(".task-list")
			.attr("data-task-id");
		var $assign = $(this);
		$.ajax({
			url: url,
			method: "POST",
			data: {
				csrfmiddlewaretoken: window.csrftoken,
				memberId: memberId,
				taskId: taskId
			},
			success: function (response) {
				$assign.closest("ul li").removeClass("active");
				$assign.addClass("active");
				showNotifications("success", response.msg);
			}
		});
	});

	$(".deleteMember").on("click", function () {
		var member_id = $(this).data("member_id");
		var url = $(this).data("member_url");
		$.ajax({
			url: url,
			method: "POST",
			data: {
				csrfmiddlewaretoken: window.csrftoken,
				memberId: member_id
			},
			success: function (response) {
				$("#chatMembers").modal("hide");
			}
		});
	});

	function getThreadMessages(status) {
		var user_id = $(".chat-discussion").attr("data-id");
		var memberId = $(".chat-discussion").data("member-user");
		var owner = $(".chat-discussion").data("project-owner");
		var messagesUrl = $(".chat-discussion").attr("data-path");
		$.ajax({
			url: messagesUrl,
			method: "GET",
			data: {
				status: status,
				last_pk: last_pk,
				name: 'ChatMessages'
			},
			dataType: "json",
			success: function (response) {
				if (response["messages"]) {
					$.each(response["messages"], function (index, value) {
						last_pk = value.pk;
						var $msgForm = $("#msg_form").clone(true, true);
						$msgForm.removeAttr("id");
						$msgForm.find(".message-avatar").attr("src", value.avatar);
						var message_date = moment(value.sent_at).format("MMM Do, h:mm a");
						$msgForm.find(".message-date").text(message_date);
						$msgForm.find(".message-content").val("");
						if (value.file_name) {
							$msgForm.find(".add-to-task").remove();
							$msgForm
								.find(".message-file")
								.append(
									"<a href=" +
									value.file +
									" download>" +
									value.file_name +
									"</a>"
								);
							$msgForm
								.find(".message-avatar-wrap")
								.addClass("not-selected-msg");
						} else {
							$msgForm.find(".message-content").val(value.content);
							$msgForm
								.find(".add-to-task")
								.attr("data-message-id", value.message_id);
							$msgForm
								.find(".add-to-task")
								.attr("data-message-text", value.content);
						}
						$msgForm.removeClass("hide");
						$msgForm
							.find(".message-avatar-wrap")
							.attr("data-author-id", value.sender_id);
						if (!value.online) {
							$msgForm.find(".message-avatar-wrap").removeClass("online");
							$msgForm.find(".message-avatar-wrap").addClass("offline");
						}
						if (parseInt(memberId) !== parseInt(value.sender_id)) {
							$msgForm.removeClass("left");
							$msgForm.addClass("right");
						} else {
							$msgForm.removeClass("right");
							$msgForm.addClass("left");
						}
						$msgForm.find(".message-author").text(value.username);
						$msgForm.find(".author-role").text("(" + value.role + ")");
						$msgForm
							.find(".author-role")
							.attr("data-author-id", value.sender_id);
						if (parseInt(user_id) === parseInt(owner)) {
							if (!value.file_name) {
								$msgForm
									.find(".message-edit")
									.attr("data-message-id", value.message_id);
							} else {
								$msgForm.find(".message-edit").remove();
							}
							$msgForm
								.find(".message-delete")
								.attr("data-message-id", value.message_id);
						} else {
							$msgForm.find(".message-edit").remove();
							$msgForm.find(".message-delete").remove();
						}
						$(".chat-discussion").append($msgForm);
						$(".ibox-content").scrollTop($(".chat-discussion")[0].scrollHeight);
					});
				}
			}
		});
	}

	$(document).on("click", ".dropdown-links li", function () {
		var role = $(this).text();
		var url = $(".chat-discussion").data("change-role-url");
		var $authorRole = $(this);
		if (role) {
			$.ajax({
				url: url,
				method: "POST",
				data: {
					authorId: authorId,
					role: role,
					csrfmiddlewaretoken: window.csrftoken
				},
				success: function (response) {
					$(".author-role[data-author-id=" + authorId + "]").text(
						"(" + role + ")"
					);
				}
			});
		}
	});

	$(document).on("click", ".author-role", function () {
		$(this)
			.next("ul")
			.toggle();
		authorId = $(this).attr("data-author-id");
	});

	$(document).on("keypress", ".message-content", function (e) {
		var code = e.keyCode ? e.keyCode : e.which;
		if (parseInt(code) === 13) {
			e.preventDefault();
			var message = $(this).val();
			var $edit = $(this);
			var messageId = $(this)
				.next("span")
				.attr("data-message-id");
			var url = $(".chat-discussion").data("edit-message-path");
			if (message) {
				$.ajax({
					url: url,
					method: "POST",
					data: {
						messageId: messageId,
						message: message,
						csrfmiddlewaretoken: window.csrftoken
					},
					success: function (response) {
						if (response.msg) {
							$edit.val(message);
							$edit.prop("disabled", true);
							showNotifications("success", response.msg);
						}
					}
				});
			}
		}
	});

	$(document).on("click", ".message-delete", function () {
		var messageId = $(this).attr("data-message-id");
		var projectId = $(".chat-discussion").data("project-id");
		var url = $(".chat-discussion").data("delete-message-url");
		var $message = $(this);
		$.ajax({
			url: url,
			method: "POST",
			data: {
				messageId: messageId,
				projectId: projectId,
				csrfmiddlewaretoken: window.csrftoken
			},
			success: function (response) {
				if (response.msg) {
					$message.closest(".chat-message").remove();
					showNotifications("success", response.msg);
				}
			}
		});
	});

	function sendMessage() {
		var message = $(".write_msg").val();
		var chatUrl = $(".chat-discussion").attr("data-chat");
		var username = $(".chat-discussion").data("username");
		var user_id = $(".chat-discussion").attr("data-id");
		var owner = $(".chat-discussion").data("project-owner");
		if (message) {
			$.ajax({
				url: chatUrl,
				method: "POST",
				data: {
					message: message,
					csrfmiddlewaretoken: window.csrftoken
				},
				success: function (response) {
					if (response.status) {
						var $msgForm = $("#msg_form").clone(true, true);
						$msgForm.removeAttr("id");
						$msgForm.removeClass("hide");
						$msgForm.removeClass("right");
						$msgForm.addClass("left");
						var message_date = moment(response.sent_at).format(
							"MMM Do, h:mm a"
						);
						$msgForm.find(".message-date").text(message_date);
						$msgForm.find(".message-content").val(message);
						$msgForm.find(".message-author").text(username);
						$msgForm
							.find(".add-to-task")
							.attr("data-message-id", response.message_id);
						$msgForm.find(".add-to-task").attr("data-message-text", message);
						$msgForm.find(".message-avatar").attr("src", response.avatar);
						$msgForm.find(".author-role").text("(" + response.role + ")");
						$msgForm
							.find(".author-role")
							.attr("data-author-id", response.sender_id);
						if (parseInt(user_id) === parseInt(owner)) {
							$msgForm
								.find(".message-edit")
								.attr("data-message-id", response.message_id);
							$msgForm
								.find(".message-delete")
								.attr("data-message-id", response.message_id);
						} else {
							$msgForm.find(".message-edit").remove();
							$msgForm.find(".message-delete").remove();
						}
						$(".chat-discussion").append($msgForm);
						$(".write_msg").val("");
					}
					$(".ibox-content").scrollTop($(".chat-discussion")[0].scrollHeight);
				}
			});
		}
	}

	function getProjectMembers() {
		var url = $(".chat-discussion").data("user-status-url");
		var projectId = $(".chat-discussion").data("project-id");
		$.ajax({
			url: url,
			method: "POST",
			data: {
				projectId: projectId,
				csrfmiddlewaretoken: window.csrftoken
			},
			success: function (response) {
				if (response["members"]) {
					$.each(response["members"], function (index, value) {
						console.log(value);
						$(
							".message-avatar-wrap[data-author-id=" + value.member_id + "]"
						).removeClass("online");
						$(
							".message-avatar-wrap[data-author-id=" + value.member_id + "]"
						).removeClass("offline");
						if (value.status) {
							$(
								".message-avatar-wrap[data-author-id=" + value.member_id + "]"
							).addClass("online");
						} else {
							$(
								".message-avatar-wrap[data-author-id=" + value.member_id + "]"
							).addClass("offline");
						}
					});
				}
			}
		});
	}

	$(".write_msg").keypress(function (e) {
		var code = e.keyCode ? e.keyCode : e.which;
		if (parseInt(code) === 13) {
			e.preventDefault();
			sendMessage();
		}
	});

	getThreadMessages();

	setInterval(function () {
		getThreadMessages(true);
	}, 3000);

	setInterval(function () {
		getProjectMembers();
	}, 60000);

	$(".js-upload-message").click(function () {
		$("#messagefileupload").click();
	});

	// if ($("#messagefileupload").fileupload) {
	// 	$("#messagefileupload").fileupload({
	// 		dataType: "json",
	// 		sequentialUploads: true,
	// 		done: function (e, data) {
	// 			var response = data.result;
	// 			if (response.is_valid) {
	// 				var username = $(".chat-discussion").data("username");
	// 				var user_id = $(".chat-discussion").attr("data-id");
	// 				var owner = $(".chat-discussion").data("project-owner");
	// 				var $msgForm = $("#msg_form").clone(true, true);
	// 				$msgForm.removeClass("hide");
	// 				$msgForm.removeClass("right");
	// 				$msgForm.addClass("left");
	// 				var message_date = moment(response.sent_at).format("MMM Do, h:mm a");
	// 				$msgForm.find(".message-date").text(message_date);
	// 				$msgForm.find(".message-content").text("");
	// 				$msgForm
	// 					.find(".message-file")
	// 					.append(
	// 						"<a href=" +
	// 						response.file +
	// 						" download>" +
	// 						response.file_name +
	// 						"</a>"
	// 					);
	// 				$msgForm.find(".message-author").text(username);
	// 				$msgForm.find(".add-to-task").remove();
	// 				$msgForm.find(".message-avatar").attr("src", response.avatar);
	// 				$msgForm.find(".author-role").text("(" + response.role + ")");
	// 				$msgForm
	// 					.find(".author-role")
	// 					.attr("data-author-id", response.sender_id);
	// 				if (parseInt(user_id) === parseInt(owner)) {
	// 					$msgForm
	// 						.find(".message-edit")
	// 						.attr("data-message-id", response.message_id);
	// 					$msgForm
	// 						.find(".message-delete")
	// 						.attr("data-message-id", response.message_id);
	// 				} else {
	// 					$msgForm.find(".message-edit").remove();
	// 					$msgForm.find(".message-delete").remove();
	// 				}
	// 				$(".chat-discussion").append($msgForm);
	// 				$(".ibox-content").scrollTop($(".chat-discussion")[0].scrollHeight);
	// 			} else {
	// 				showNotifications("error", response.msg);
	// 			}
	// 		}
	// 	});
	// }

	if ($(".screen-image-exist").length == 1) {
		$(".screen_actions").hide();
	}

	$(".screen-delete").on("click", function (e) {
		var url = $(this).data("href");
		var screenId = $(this).data("screen-id");
		var $deleted = $(this);
		$.ajax({
			url: url,
			method: "POST",
			data: {
				csrfmiddlewaretoken: window.csrftoken,
				screenId: screenId
			},
			success: function (response) {
				showNotifications("success", response.msg);
				$deleted
					.parent("div")
					.parent("div")
					.remove();
				if ($(".screen-image-exist").length == 1) {
					$(".screen_actions").hide();
					$("#screenImage div").remove();
					$("#screenImage img").attr("src", "");
				}
			}
		});
	});

	// Invite
	$("#inviteUser").on("click", function (e) {
		e.preventDefault();
		var name = $("#id_name").val();
		var role = $("#id_role").val();
		var email = $("#id_email").val();
		var url = $(this).data("url");

		var formValid = validateForm(["#id_name", "#id_email", "#id_role"]);
		if (!formValid) {
			$.ajax({
				url: url,
				method: "POST",
				data: {
					csrfmiddlewaretoken: window.csrftoken,
					name: name,
					email: email,
					role: role
				},
				success: function (response) {
					showNotifications("success", response.msg);
					$("#inviteUserForm")[0].reset();
				},
				error: function (xhr, status, error) {
					var response = jQuery.parseJSON(xhr.responseText);
					showNotifications("error", response.msg);
				}
			});
		}
	});

	$("#searchUser").on("click", function (e) {
		e.preventDefault();
		var url = $(this).data("url");
		var position = $("#id_position").val();
		var rate_from = $("#id_rate_from").val();
		var rate_to = $("#id_rate_to").val();

		$.ajax({
			url: url,
			method: "POST",
			data: {
				csrfmiddlewaretoken: window.csrftoken,
				position: position,
				rate_from: rate_from,
				rate_to: rate_to
			},
			success: function (response) {
				if (response["users"].length > 0) {
					$.each(response["users"], function (index, value) {
						var $inviteForm = $("#searchUserInvite").clone(true, true);
						$inviteForm.removeClass("hide");
						$inviteForm.removeAttr("id");
						if (value.teammember__team__team_name) {
							var team_name = value.teammember__team__team_name;
						} else {
							var team_name = "No team";
						}
						$inviteForm.find(".team-name").text(team_name);
						$inviteForm
							.find(".user-name")
							.text(value.first_name + " " + value.last_name);
						$inviteForm
							.find(".label")
							.text(parseInt(value.profile__hourly_rate) + "$/hr");
						$inviteForm.find(".block").text(value.profile__role);
						if (value.profile__avatar) {
							$inviteForm
								.find("img")
								.attr("src", "/media/" + value.profile__avatar);
						} else {
							$inviteForm.find("img").attr("src", response["no_image"]);
						}
						$inviteForm.find("button").attr("data-user-id", value.pk);
						$(".search-result .row").append($inviteForm);
					});
				} else {
					$(".search-result .row").html("");
				}
			},
			error: function (xhr, status, error) {
				var response = jQuery.parseJSON(xhr.responseText);
				showNotifications("error", response.msg);
			}
		});
	});

	$(document).on("click", "#inviteSearchedUser", function () {
		var url = $(this).attr("data-url");
		var projectId = $(this).attr("data-project-id");
		var userId = $(this).attr("data-user-id");
		$.ajax({
			url: url,
			method: "POST",
			data: {
				csrfmiddlewaretoken: window.csrftoken,
				userId: userId,
				projectId: projectId
			},
			success: function (response) {
				showNotifications("success", response.msg);
				$("#inviteUserForm")[0].reset();
			},
			error: function (xhr, status, error) {
				var response = jQuery.parseJSON(xhr.responseText);
				showNotifications("error", response.msg);
			}
		});
	});

	$(".workflow-list img").on("click", function () {
		$("#workflowModal").modal();
		var assignee = $(this).data("asignee-user-name");
		if (assignee.length > 1) {
			$("#assignedUser").text(assignee);
		} else {
			$("#assignedUser").text("No assignee");
		}
		workflowScreenId = $(this).data("screen-id");
		screenStatus = $(this).data("screen-status");
		for (var key in statusColor) {
			$("#statusChange").removeClass(statusColor[key]);
		}
		$("#statusChange").addClass(statusColor[screenStatus]);
	});

	$(document).on("click", "#collaboratordDropdown a", function () {
		var assignee = $(this).data("assigne");
		var assignee_name = $(this).text();
		$("#assignedUser").text(assignee_name);
		var url = $("#collaboratordDropdown").data("url");
		$.ajax({
			url: url,
			method: "POST",
			data: {
				csrfmiddlewaretoken: window.csrftoken,
				assignee: assignee,
				screenId: workflowScreenId
			},
			success: function (response) {
				showNotifications("success", response.msg);
				$("#collaboratordDropdown").removeClass("show");
				$(".workflow-list img[data-screen-id=" + workflowScreenId + "]").attr(
					"data-asignee-user-name",
					assignee_name
				);
			}
		});
	});

	$(document).on("click", "#assignedUser", function () {
		$("#collaboratordDropdown").toggleClass("show");
		$("#statusDropdown").removeClass("show");
	});

	$(document).on("keyup", "#searchInput", function () {
		var input, filter, ul, li, a, i, div;
		input = document.getElementById("searchInput");
		filter = input.value.toUpperCase();
		div = document.getElementById("collaboratordDropdown");
		a = div.getElementsByTagName("a");
		for (i = 0; i < a.length; i++) {
			if (a[i].innerHTML.toUpperCase().indexOf(filter) > -1) {
				a[i].style.display = "";
			} else {
				a[i].style.display = "none";
			}
		}
	});

	$("#workflowModal").on("hidden.bs.modal", function () {
		$("#collaboratordDropdown").removeClass("show");
		$("#statusDropdown").removeClass("show");
	});

	$(document).on("click", "#statusChange", function () {
		$("#statusDropdown").toggleClass("show");
		$("#collaboratordDropdown").removeClass("show");
		$("#statusDropdown li[data-status=" + screenStatus + "]").addClass(
			"active-status"
		);
	});

	$(document).on("click", ".message-edit", function () {
		$(".message-content").prop("disabled", true);
		var $prevInput = $(this).prev("input");
		$prevInput.prop("disabled", function (i, v) {
			return !v;
		});
	});

	$(document).on("click", "#statusDropdown li", function () {
		var status = $(this).data("status");
		var url = $("#statusDropdown").data("url");
		$(this).addClass("active-status");
		$("#statusChange").addClass(statusColor[status]);
		$.ajax({
			url: url,
			method: "POST",
			data: {
				csrfmiddlewaretoken: window.csrftoken,
				status: status,
				screenId: workflowScreenId
			},
			success: function (response) {
				showNotifications("success", response.msg);
				$("#statusDropdown").toggleClass("show");
				$(".workflow-list img[data-screen-id=" + workflowScreenId + "]").attr(
					"data-screen-status",
					status
				);
			}
		});
	});

	$("#addChatTask").hide();
	$(document).on("click", "#addChatTask", function () {
		$("#editTaskButton").hide();
		var out = [];
		for (var key in taskMessages) {
			out.push(taskMessages[key]);
		}
		var description = out.join("\n");
		$("#id_description").text(description);
	});

	$(document).on("click", ".add-to-task", function () {
		var message_id = $(this).attr("data-message-id");
		var content = $(this).attr("data-message-text");
		if ($(this).is(":checked")) {
			taskMessages[message_id] = content;
		} else {
			delete taskMessages[message_id];
		}

		if ($(".add-to-task").is(":checked")) {
			$("#addChatTask").show();
		} else {
			$("#addChatTask").hide();
		}
	});
})();
