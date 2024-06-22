import React from "react";

const VotingPatternTable = ({ data }) => {
  const categories = ["YES", "NO", "ABSENT", "UNKNOWN"];

  const getCategoryData = (category) => {
    return data.filter(
      (member) => (member.vote || "UNKNOWN").toUpperCase() === category
    );
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <h1 className="text-2xl font-bold mb-6 text-center">
        Members of Parliament Voting Patterns - 2024 Financial Bill
      </h1>
      <div className="w-full flex flex-wrap justify-center">
        {categories.map((category) => (
          <div key={category} className="w-full sm:w-1/2 lg:w-1/4 p-2">
            <div className="bg-white rounded-lg shadow-lg p-4">
              <h2 className="text-xl font-semibold mb-4 text-center">
                {category}
              </h2>
              <ul className="list-disc list-inside">
                {getCategoryData(category).map((member, index) => (
                  <li key={index} className="mb-2">
                    <div className="flex items-center">
                      <img
                        src={member.image}
                        alt={member.name}
                        className="w-10 h-10 object-cover rounded-full mr-2"
                      />
                      <div>
                        <p className="font-semibold">{member.name}</p>
                        <p className="text-sm">
                          {member.constituency}, {member.county}
                        </p>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>
      <p className="mt-6 text-sm text-gray-600 text-center">From Sam Otieno</p>
    </div>
  );
};

export default VotingPatternTable;
