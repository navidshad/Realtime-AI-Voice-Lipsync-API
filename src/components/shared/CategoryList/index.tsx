const CategoryList = ({ categories }: { categories: string[] }) => {
  return (
    <div className="flex flex-wrap justify-center items-center gap-4 p-6">
      {categories.map((category) => (
        <div
          key={category}
          className="px-6 py-3 bg-blue-100 text-blue-800 rounded-full 
            shadow-sm hover:shadow-md transition-shadow duration-200
            font-medium cursor-pointer hover:bg-blue-200"
        >
          {category}
        </div>
      ))}
    </div>
  );
};

export default CategoryList;
