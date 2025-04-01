export default function ToDo(){
  return <h1>Todo</h1>
}


 // For the rearranging the List .
// "use client";

// import { useEffect, useState } from "react";
// import { DndContext, closestCenter, DragEndEvent } from "@dnd-kit/core";
// import {
//   SortableContext,
//   verticalListSortingStrategy,
//   arrayMove,
//   useSortable,
// } from "@dnd-kit/sortable";
// import { CSS } from "@dnd-kit/utilities";

// // Define TypeScript types for props
// interface ItemProps {
//   id: string;
//   name: string;
// }

// function SortableItem({ id, name, onDelete }: ItemProps & { onDelete: (id: string) => void }) {
//   const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id });

//   const style = {
//     transform: CSS.Transform.toString(transform),
//     transition,
//     padding: "10px",
//     border: "1px solid gray",
//     margin: "5px",
//     backgroundColor: "lightgray",
//     cursor: "grab",
//     display: "flex",
//     justifyContent: "space-between",
//   };

//   return (
//     <div ref={setNodeRef} {...attributes} {...listeners} style={style}>
//       {name}
//       <button onClick={() => onDelete(id)} style={{ marginLeft: "10px", cursor: "pointer" }}>❌</button>
//     </div>
//   );
// }

// export default function TodoList() {
//   const [items, setItems] = useState<ItemProps[]>([]);

//   // Load todos from local storage on mount
//   useEffect(() => {
//     const savedTodos = localStorage.getItem("todos");
//     if (savedTodos) {
//       setItems(JSON.parse(savedTodos));
//     }
//   }, []);

//   // Save todos to local storage whenever items change
//   useEffect(() => {
//     localStorage.setItem("todos", JSON.stringify(items));
//   }, [items]);

//   // Handle Drag and Drop
//   const handleDragEnd = (event: DragEndEvent) => {
//     const { active, over } = event;
//     if (!over) return;

//     if (active.id !== over.id) {
//       const oldIndex = items.findIndex((item) => item.id === active.id);
//       const newIndex = items.findIndex((item) => item.id === over.id);
//       setItems(arrayMove(items, oldIndex, newIndex));
//     }
//   };

//   // Handle Delete
//   const handleDelete = (id: string) => {
//     const updatedTodos = items.filter((item) => item.id !== id);
//     setItems(updatedTodos);
//     localStorage.setItem("todos", JSON.stringify(updatedTodos)); // Remove from local storage
//   };

//   return (
//     <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
//       <SortableContext items={items.map((item) => item.id)} strategy={verticalListSortingStrategy}>
//         {items.map((item) => (
//           <SortableItem key={item.id} id={item.id} name={item.name} onDelete={handleDelete} />
//         ))}
//       </SortableContext>
//     </DndContext>
//   );
// }
