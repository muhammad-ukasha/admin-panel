export function Label({ children, ...props }) {
    return (
      <label
        className="block mb-1 text-gray-700 font-semibold"
        {...props}
      >
        {children}
      </label>
    );
  }
  