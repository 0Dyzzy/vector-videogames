export default function CategoryFilter({ categories, selected, onSelect }) {
  const options = ['Todas', ...categories];

  return (
    <div
      className="category-filter"
      role="group"
      aria-label="Filtrar videojuegos por categoría"
    >
      {options.map((category) => {
        const isActive = category === selected;
        return (
          <button
            key={category}
            type="button"
            className={`category-filter__btn${isActive ? ' is-active' : ''}`}
            aria-pressed={isActive}
            onClick={() => onSelect(category)}
          >
            {category}
          </button>
        );
      })}
    </div>
  );
}
