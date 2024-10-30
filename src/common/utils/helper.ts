function formatFieldName(fieldName) {
  // Split the string at uppercase letters
  let result = fieldName.replace(/([A-Z])/g, ' $1');
  // Capitalize the first letter of the entire string
  result = result.charAt(0).toUpperCase() + result.slice(1);
  return result;
}

export function getErrorMessages(e: any) {
  const errors: string[] = [];
  Object.keys(e.keyValue).map((key) => {
    // switch statement, in case we want specific error messages for a specific field
    switch (key) {
      case 'email':
      case 'username':
      case 'phone':
      default:
        const field = formatFieldName(key);
        errors.push(`${field} already exists`);
        break;
    }
  });
  return errors;
}
