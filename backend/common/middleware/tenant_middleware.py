from tenants.models.organization import Organization


class TenantMiddleware:

    def __init__(self, get_response):

        self.get_response = get_response

    def __call__(self, request):

        tenant_id = request.headers.get(
            "X-Tenant-ID"
        )

        request.tenant = None

        if tenant_id:

            try:

                request.tenant = Organization.objects.get(
                    id=tenant_id
                )

            except Organization.DoesNotExist:

                request.tenant = None

        response = self.get_response(request)

        return response
