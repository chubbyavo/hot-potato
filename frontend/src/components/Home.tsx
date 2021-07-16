import React from "react";

const Home: React.FC = () => {
  return (
    <div className="container mx-auto">
      <div className="text-8xl text-center mt-4">🥔</div>
      <div className="mt-4">
        <div className="text-center">
          <h1>Recent Activities</h1>
        </div>
        <div className="flex justify-center">
          <table>
            <tr>
              <th>Action</th>
              <th>Token ID</th>
              <th>From</th>
              <th>To</th>
              <th>Txn</th>
            </tr>
            <tr>
              <td>Mint</td>
              <td>1</td>
              <td>0xa</td>
              <td>n/a</td>
              <td>tx link</td>
            </tr>
            <tr>
              <td>Toss</td>
              <td>1</td>
              <td>0xa</td>
              <td>0xb</td>
              <td>tx link</td>
            </tr>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Home;
