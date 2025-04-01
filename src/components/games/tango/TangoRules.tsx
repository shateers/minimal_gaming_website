
const TangoRules = () => {
  return (
    <div className="mt-8 p-6 bg-white rounded-lg shadow-sm border border-border">
      <h2 className="text-xl font-bold mb-4">Rules</h2>
      <ul className="list-disc pl-5 space-y-2">
        <li>Fill the grid with 0s and 1s.</li>
        <li>Each row and column must contain an equal number of 0s and 1s.</li>
        <li>No more than two identical digits can be adjacent horizontally or vertically.</li>
        <li>Each row and column must be unique.</li>
      </ul>
    </div>
  );
};

export default TangoRules;
