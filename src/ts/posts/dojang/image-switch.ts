export function initImageSwitch(root: HTMLElement): void {
  const versions = Array.from(root.querySelectorAll<HTMLElement>('[data-image-version]'));
  const controls = root.querySelector<HTMLElement>('[data-image-controls]');
  const group = root.querySelector<HTMLElement>('[data-image-versions]');
  if (!controls || !group || versions.length < 2) return;
  let selected = -1;
  const buttons: HTMLButtonElement[] = [];
  const select = (index: number): void => {
    if (index === selected) return;
    versions[index].querySelector('[data-image-plate]')!.append(controls);
    versions.forEach((version, i) => { version.hidden = i !== index; });
    buttons.forEach((button, i) => button.setAttribute('aria-pressed', String(i === index)));
    selected = index;
  };
  versions.forEach((version, index) => {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'writing-control';
    button.textContent = version.dataset.imageVersion!;
    button.addEventListener('click', () => {
      select(index);
      button.focus({ preventScroll: true });
    });
    buttons.push(button);
    group.append(button);
  });
  controls.hidden = false;
  select(0);
}
