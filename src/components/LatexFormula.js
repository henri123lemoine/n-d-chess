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
      window.katex.render(formula, containerRef.current, {
        throwOnError: false,
        displayMode: true
      });
    }
  }, [formula]);

  return <div ref={containerRef} className="latex-formula"></div>;
};

export default LatexFormula;
