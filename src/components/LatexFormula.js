import React, { useEffect, useRef } from 'react';

/**
 * Component to render LaTeX formulas using KaTeX
 *
 * @param {Object} props Component props
 * @param {string} props.formula The LaTeX formula to render
 * @returns {JSX.Element} Rendered formula
 */
const LatexFormula = ({ formula }) => {
  const containerRef = useRef(null);

  useEffect(() => {
    if (containerRef.current && window.katex) {
      try {
        window.katex.render(formula, containerRef.current, {
          throwOnError: false,
          displayMode: true,
          fleqn: false,
          leqno: false,
          strict: false,
          trust: true,
          macros: {
            "\\mathbb": "\\mathbf"
          }
        });
      } catch (error) {
        console.error('Error rendering LaTeX formula:', error);
        containerRef.current.textContent = 'Error rendering formula: ' + formula;
      }
    }
  }, [formula]);

  return <div ref={containerRef} className="latex-formula"></div>;
};

export default LatexFormula;
