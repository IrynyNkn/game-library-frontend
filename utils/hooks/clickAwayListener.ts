import React, { useEffect } from 'react';

function clickAwayListener(
  ref: React.RefObject<any>,
  fireEvent: boolean,
  handleClick: () => void
) {
  useEffect(() => {
    function handleClickOutside(event: any) {
      if (fireEvent && ref?.current && !ref.current.contains(event.target)) {
        handleClick();
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [ref, fireEvent]);
}

export default clickAwayListener;
