import { IBlog } from '../types/blog.types';

export const SearchModal = ({ blogs }: { blogs: IBlog[] }) => {
  return (
    <dialog
      id="my_modal_5"
      className="modal modal-bottom sm:modal-middle backdrop-blur-sm"
    >
      <div className="modal-box bg-gray-900 p-0">
        {/* SEARCH INPUT */}
        <div className="flex items-center w-full gap-3 p-6 shadow-xl">
          <input
            type="text"
            className="input input-bordered h-10 border-2 border-slate-600 w-full rounded-md bg-transparent"
          />
          <kbd className="kbd kbd-md bg-transparent border-slate-600">Esc</kbd>
        </div>

        {/* LIST OF BLOGS */}
        <div className="flex flex-col gap-4 overflow-y-auto h-64">
          {blogs.map((blog) => {
            return (
              <div
                key={blog.title}
                className="hover:bg-sky-600 hover:cursor-pointer px-6"
              >
                <h3 className="text-lg">{blog.title}</h3>
                <p className="text-gray-400">
                  {blog.summary.substring(0, 50)}...
                </p>
              </div>
            );
          })}
        </div>
        <div className="modal-action"></div>
      </div>
    </dialog>
  );
};
