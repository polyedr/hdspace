from projects.models import Project


def get_projects(request):
    projects_list = []
    if request.user.is_authenticated:
        projects = Project.objects.filter(user=request.user)
        for project in projects:
            new_project = dict(
                name=project.name,
                url=project.get_project_url()
            )
            projects_list.append(new_project)
    return {
        "projects_list": projects_list
    }
