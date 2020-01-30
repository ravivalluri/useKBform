import React, { useEffect } from 'react';

export default function Form({ children }) {
  useEffect(() => {
    console.log(
      React.Children.map(children || null, child => {
        return child.props.children.map(item => {
          return item;
        });
      })
    );
  });

  return children;
}
