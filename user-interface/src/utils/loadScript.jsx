const loadScript = (url, callback) => {
  // Check if script is already present
  if (document.querySelector(`script[src="${url}"]`)) {
    callback();
    return;
  }

  const script = document.createElement("script");
  script.src = url;
  script.async = true;
  script.defer = true;
  script.onload = callback;
  document.head.appendChild(script);
};

export default loadScript;
