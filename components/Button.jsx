export default function Button(props) {
  function handleClick(evt) {
    evt.preventDefault();

    console.log('Button clicked');

    if (typeof props.fClick === 'function') {
      props.fClick();
    }
  }

  return (
    <div
      onClick={handleClick}
      className='text-sm px-4 py-2 rounded-md text-center cursor-pointer bg-gray-400 hover:bg-gray-500 hover:bg-opacity-50 bg-opacity-50 text-gray-800'
    >
      {props.children ?? <span>{props.text ?? 'Default Button Text'}</span>}
    </div>
  );
}
