import React from 'react';

interface IList {
  id: string,
  parent: string,
  type: string,
  children: string[],
}

interface IProps {
  id: string,
}

interface IState {
  items: IList[],
}

class Component extends React.Component<IProps, IState> {
  constructor(props) {
    super(props);

    this.draggedItem = null;
    this.state = {
      items: props.children,
    };
  }

  onDragStart = index => (e) => {
    const { items } = this.state;

    this.draggedItem = items[index];
    e.dataTransfer.effectAllowed = 'move'; // visual effect will be moving the item
    e.dataTransfer.setData('text/html', e.target.parentNode); // sets the dragged item to be the parent node
    e.dataTransfer.setDragImage(e.target.parentNode, 20, 20); // dragged item ... for Chrome
  };

  onDragOver = (index: number) => {
    const { items } = this.state;
    const draggedOverItem = items[index];

    // if the item is dragged over itself, ignore
    if (this.draggedItem === draggedOverItem) {
      return;
    }

    // filter out the currently dragged item
    const newItems: IList[] = items.filter(item => item !== this.draggedItem);

    // add the dragged item after the dragged over item
    newItems.splice(index, 0, this.draggedItem);

    this.setState({ items: newItems });
  };

  onDragEnd = () => {
    this.draggedItem = null;
  };

  draggedItem;

  render() {
    const {
      props: { id },
      state: { items },
    } = this;

    return (
      <ul key={id} className="group">
        {
          items.map((item, idx) => (
            <li
              key={item.id}
              className="elem"
              onDragOver={() => this.onDragOver(idx)}
            >
              <div
                className="drag"
                draggable
                onDragStart={this.onDragStart(idx)}
                onDragEnd={this.onDragEnd}
              >
                {item.id}
              </div>
            </li>
          ))
        }
      </ul>
    );
  }
}

export const TestSortable = Component;
