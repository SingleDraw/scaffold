console.log('Hello TypeScript! 🚀');

// Example function with types
function greet(name: string): string {
  return `Hello, ${name}!`;
}

// Example interface
interface User {
  id: number;
  name: string;
  email: string;
}

const user: User = {
  id: 1,
  name: 'John Doe',
  email: 'john@example.com'
};

console.log(greet(user.name));
console.log('User:', user);

// Export for potential imports
export { greet, User };