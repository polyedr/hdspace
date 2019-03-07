class SEOViewMixin(object):

    page_title = None
    meta_description = None

    def pre_dispatch(self):
        if hasattr(super(SEOViewMixin, self), "pre_dispatch"):
            # noinspection PyUnresolvedReferences
            super(SEOViewMixin, self).pre_dispatch()

    def get_page_title(self):
        return self.page_title

    def get_meta_description(self):
        return self.meta_description

    def get_context_data(self, **kwargs):
        # noinspection PyUnresolvedReferences
        data = super(SEOViewMixin, self).get_context_data(**kwargs)
        data["page_title"] = self.get_page_title()
        data["meta_description"] = self.get_meta_description()
        return data

    def dispatch(self, request, *args, **kwargs):
        self.pre_dispatch()
        # noinspection PyUnresolvedReferences
        return super(SEOViewMixin, self).dispatch(request, *args, **kwargs)
