from projects.models import ProjectMember


def get_projects(request):
    projects_list = []
    if request.user.is_authenticated:
        projects = ProjectMember.objects.filter(user=request.user, is_active=True)
        for project in projects:
            new_project = dict(
                name=project.project.name,
                url=project.project.get_project_url()
            )
            projects_list.append(new_project)
    return {
        "projects_list": projects_list
    }
