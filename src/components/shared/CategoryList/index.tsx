const CategoryList = ({ categories }: { categories: string[] }) => {
  return (
    <div className="flex justify-center items-center p-6 h-full mx-5">
        <div className="flex flex-wrap items-center justify-center gap-4">
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
    </div>
  );
};

export default CategoryList;
