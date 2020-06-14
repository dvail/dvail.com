let theme = localStorage.getItem('theme') || 'dark'

function updateTheme(newTheme) {
  if (newTheme === 'dark') {
    document.body.classList.add('dark')
    document.body.classList.remove('light')
  } else {
    document.body.classList.add('light')
    document.body.classList.remove('dark')
  }
  theme = newTheme
  localStorage.setItem('theme', newTheme)
}

updateTheme(theme)

document.getElementById('theme-switch').addEventListener('click', () => {
  if (theme === 'dark') {
    updateTheme('light')
  } else {
    updateTheme('dark')
  }
})