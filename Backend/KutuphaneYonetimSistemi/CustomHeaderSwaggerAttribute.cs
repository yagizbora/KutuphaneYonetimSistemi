﻿using Microsoft.OpenApi.Models;
using Swashbuckle.AspNetCore.SwaggerGen;

namespace KutuphaneYonetimSistemi
{
    public class CustomHeaderSwaggerAttribute : IOperationFilter
    {

        public void Apply(OpenApiOperation operation, OperationFilterContext context)
        {
            if (operation.Parameters == null)
                operation.Parameters = new List<OpenApiParameter>();

            //operation.Parameters.Add(new OpenApiParameter
            //{
            //    Name = "token",
            //    In = ParameterLocation.Header,
            //    Required = false,
            //    Schema = new OpenApiSchema
            //    {
            //        Type = "string"
            //    }
            //});

        }

    }
}