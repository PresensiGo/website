# Define variables for URLs and file names
SWAGGER_V2_URL := http://localhost:8080/swagger/doc.json
DOCS_DIR := ./src/docs
SWAGGER_V2_FILE := $(DOCS_DIR)/doc.v2.json
OPENAPI_V3_FILE := $(DOCS_DIR)/doc.v3.json
TS_API_OUTPUT := ./src/lib/api/v1.d.ts
SWAGGER_CONVERT_API := https://converter.swagger.io/api/convert

.PHONY: api download-swagger-v2 convert-to-v3 generate-openapi-typescript

# Main target to run the entire process
api: download-swagger-v2 convert-to-v3 generate-openapi-typescript

# 1. Download the Swagger (v2) spec from the Go application.
download-swagger-v2:
	@echo "Downloading Swagger v2 spec to $(SWAGGER_V2_FILE)..."
	curl -o $(SWAGGER_V2_FILE) $(SWAGGER_V2_URL)

# 2. Convert the Swagger (v2) spec to OpenAPI (v3) using the converter API.
#    This command reads the v2 file, posts it to the converter, and saves the v3 output.
convert-to-v3: download-swagger-v2
	@echo "Converting Swagger v2 to OpenAPI v3..."
	curl -X POST \
		-H "accept: application/json" \
		-H "Content-Type: application/json" \
		--data-binary "@$(SWAGGER_V2_FILE)" \
		"$(SWAGGER_CONVERT_API)" > $(OPENAPI_V3_FILE)

# 3. Generate TypeScript types from the converted OpenAPI (v3) spec.
generate-openapi-typescript: convert-to-v3
	@echo "Generating TypeScript types from OpenAPI v3..."
	npx openapi-typescript $(OPENAPI_V3_FILE) -o $(TS_API_OUTPUT)