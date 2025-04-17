import React, { useState } from 'react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';

function DraggableList() {
  // Sample initial items
  const [items, setItems] = useState([
    { id: 'item-1', content: 'Item 1' },
    { id: 'item-2', content: 'Item 2' },
    { id: 'item-3', content: 'Item 3' },
    { id: 'item-4', content: 'Item 4' },
    { id: 'item-5', content: 'Item 5' },
  ]);

  // Handle the end of a drag operation
  const onDragEnd = (result) => {
    // If dropped outside the list
    if (!result.destination) {
      return;
    }

    // Reorder items
    const newItems = Array.from(items);
    const [reorderedItem] = newItems.splice(result.source.index, 1);
    newItems.splice(result.destination.index, 0, reorderedItem);

    setItems(newItems);
  };

  return (
    <div className="draggable-list-container">
      <h2>Draggable List</h2>
      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="droppable">
          {(provided) => (
            <div
              {...provided.droppableProps}
              ref={provided.innerRef}
              style={{
                padding: 8,
                width: 250,
                backgroundColor: '#f8f8f8',
                borderRadius: 4,
              }}
            >
              {items.map((item, index) => (
                <Draggable key={item.id} draggableId={item.id} index={index}>
                  {(provided) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      style={{
                        userSelect: 'none',
                        padding: 16,
                        margin: '0 0 8px 0',
                        backgroundColor: 'white',
                        borderRadius: 4,
                        border: '1px solid #ddd',
                        ...provided.draggableProps.style,
                      }}
                    >
                      {item.content}
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
    </div>
  );
}

export default DraggableList;