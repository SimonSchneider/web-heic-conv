export function getControls(containerId) {
  const container = document.getElementById(containerId);
  const inputs = container.querySelectorAll('input, select');
  return Array.from(inputs).reduce((acc, input) => {
    return Object.defineProperty(acc, input.id, {
      get() {
        const t = input.type;
        switch (t) {
          case 'checkbox':
            return input.checked;
          case 'number':
          case 'range':
            return Number(input.value);
          default:
            return input.value;
        }
      },
    });
  }, {});
}

export function fileInputSource(inputId, callback) {
  document.getElementById(inputId).addEventListener('change', async (e) => {
    const files = e.target.files;
    if (!files.length) {
      return;
    }
    for (const file of files) {
      callback(file);
    }
  });
}

export function downloadElem() {
  const a = document.createElement('a');
  a.textContent = 'Download';
  a.setAttribute('class', 'disabled');
  return a;
}

export function downloadReady(elem, blob, name, newExt, autoDownload) {
  elem.href = URL.createObjectURL(blob);
  elem.setAttribute('class', '');
  elem.download = name.slice(0, name.lastIndexOf('.') + 1) + newExt;
  if (autoDownload) {
    elem.click();
  }
}

export function getFileList(listId) {
  const fileListElem = document.getElementById(listId);
  return {
    add(file) {
      const fileElem = document.createElement('li');
      const nameElem = fileElem.appendChild(document.createElement('span'));
      nameElem.textContent = file.name;
      const aElem = fileElem.appendChild(downloadElem());
      fileListElem.appendChild(fileElem);
      return {
        downloadReady: (blob, newExt, autoDownload) => {
          downloadReady(aElem, blob, file.name, newExt, autoDownload);
        },
      };
    },
  };
}
