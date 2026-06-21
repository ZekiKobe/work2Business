import {
  Bell,
  Search
} from "lucide-react";

import {
  useContext
} from "react";

import {
  AuthContext
} from "../../context/AuthContext";

export default function Topbar() {

  const { user } =
    useContext(AuthContext);

  return (
    <header
      className="
      h-20
      bg-white
      border-b
      px-6
      flex
      items-center
      justify-between
      "
    >

      <div
        className="
        flex
        items-center
        gap-3
        "
      >

        <Search size={18} />

        <input
          placeholder="Search..."
          className="
          outline-none
          "
        />

      </div>

      <div
        className="
        flex
        items-center
        gap-6
        "
      >

        <Bell size={20} />

        <div
          className="
          flex
          items-center
          gap-3
          "
        >

          <div
            className="
            h-10
            w-10
            rounded-full
            bg-blue-600
            text-white
            flex
            items-center
            justify-center
            font-bold
            "
          >
            {user?.firstName?.[0]}
          </div>

          <div>

            <p className="font-medium">
              {user?.firstName}
            </p>

            <p
              className="
              text-sm
              text-gray-500
              "
            >
              Employee
            </p>

          </div>

        </div>

      </div>

    </header>
  );
}