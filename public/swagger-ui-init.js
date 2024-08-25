window.onload = function() {
    const ui = SwaggerUIBundle({
      url: "/api-docs/swagger.json", // Cambia esta URL si es necesario
      dom_id: '#swagger-ui',
      presets: [SwaggerUIBundle.presets.apis, SwaggerUIStandalonePreset],
      layout: "StandaloneLayout"
    });
    
    window.ui = ui;
  };  