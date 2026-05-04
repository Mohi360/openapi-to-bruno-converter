---
description: 'Official OpenAPI Bruno collection generation instructions that help GitHub Copilot to generate Bruno collection using the official OpenAPI to OpenCollection converter. These instructions cover the conversion process, collection structure, request definitions, environment variables, scripting API, and best practices for organizing and maintaining the collections.'
applyTo: '*.yaml, *.yml'
---

# Generate Bruno collection from OpenAPI Specification
The converter is a package that can be imported as a library in Node.js projects. It takes an OpenAPI specification file (in YAML format) as input and generates single YAML file representing a structured collection following the OpenCollection specification.
The generated YAML file needs to be then imported to Bruno (using UI or CLI) to create a Bruno collection that represents the API defined in the OpenAPI specification.
In order to generate the Bruno collection from OpenAPI specification, you need to implement the conversion logic. You might need to use some tools, such as Node.js, npm packages, command-line interface (CLI) commands, etc to run the converter and generate the collection files. Using relevant tools, commands, scripts, packages, etc is allowed to complete the conversion process, but make sure to follow the instructions and guidelines provided in the official converter documentation to ensure a successful conversion.
To generate the Bruno collection from OpenAPI specification, you need to follow these steps:
1. Check if the npm package @usebruno/converters is installed. You can find the package documentation at: https://www.npmjs.com/package/@usebruno/converters
2. Implement the conversion logic. you can find the sample code snippet at the end of this file.
3. Run the conversion logic by providing the path to your OpenAPI YAML file and the desired output path for the generated Bruno collection in YAML format.
4. After running the conversion logic, you should have a generated Bruno collection in YAML format but the conversion process is not complete yet. Last step is using Bruno CLI to convert this flat collection file to structured Bruno collection. In order to do this, follow the instructions at https://docs.usebruno.com/bru-cli/import

# Sample Code Snippet
This is a sample code snippet demonstrating how to use the OpenAPI to Bruno converter in a Node.js environment. The code reads an OpenAPI YAML file, converts it to a Bruno collection using the converter.

```javascript theme={null}
const { openApiToBruno, yamlToJson } = require('@usebruno/converters');
const { readFile, writeFile } = require('fs/promises');

// Function to convert OpenAPI YAML file to Bruno collection JSON file
// Note: Make sure to replace 'path/to/your/openapi.yaml' and 'path/to/bruno-collection' with actual file paths when running the code.
async function openApiToBrunoConversion(openApiYamlFile, outputBrunoCollectionFile) {
const yamlContent = await readFile(openApiYamlFile, 'utf8');
const jsonSpec = yamlToJson(yamlContent);
if (jsonSpec) {
  try {
    const brunoCollection = openApiToBruno(jsonSpec);
    await writeFile(outputBrunoCollectionFile, JSON.stringify(brunoCollection, null, 2));
    console.log('Full conversion pipeline successful!');
  } catch (error) {
    console.error('Bruno conversion error:', error.message);
  }
}
}

openApiToBrunoConversion('path/to/your/openapi.yaml', 'path/to/bruno-collection.json');
```
