"use client";
import styled from "styled-components";
import { useRouter } from "next/navigation";

const Button = () => {
  const router = useRouter();

  return (
    <StyledWrapper onClick={() => router.push("/book")}>
      <button className="button">
        <div className="bgContainer">
          <span>Online Classes</span>
          <span>Online Classes</span>
        </div>
        <div className="arrowContainer">
          <svg
            width={25}
            height={25}
            viewBox="0 0 45 38"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M43.7678 20.7678C44.7441 19.7915 44.7441 18.2085 43.7678 17.2322L27.8579 1.32233C26.8816 0.34602 25.2986 0.34602 24.3223 1.32233C23.346 2.29864 23.346 3.88155 24.3223 4.85786L38.4645 19L24.3223 33.1421C23.346 34.1184 23.346 35.7014 24.3223 36.6777C25.2986 37.654 26.8816 37.654 27.8579 36.6777L43.7678 20.7678ZM0 21.5L42 21.5V16.5L0 16.5L0 21.5Z"
              fill="black"
            />
          </svg>
        </div>
      </button>
    </StyledWrapper>
  );
};

const StyledWrapper = styled.div`
  button {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0.6em 0.8em 0.6em 1.5em;
    gap: 1.5em; /* dynamically gives width to button without hacking widths */
    background-color: #bc6746; /* Organic earthy accent */
    color: #FFFDF8;
    cursor: pointer;
    box-shadow: 0px 4px 15px rgba(0,0,0,0.3); /* Softer drop shadow for modern organic theme */
    border: 1px solid rgba(255,255,255,0.1);
    border-radius: 50px; /* Pill radius */
    position: relative;
    overflow: hidden;
    z-index: 100;
    transition:
      box-shadow 250ms,
      transform 250ms,
      filter 50ms;
  }
  button:hover {
    transform: translateY(-2px);
    box-shadow: 0px 6px 20px rgba(188,103,70,0.4);
  }
  button:active {
    filter: saturate(0.75);
    transform: translateY(0px);
  }
  
  /* Sliding hover background */
  button::after {
    content: "";
    position: absolute;
    inset: 0;
    background-color: #a55a3d; /* Darker earth color */
    z-index: -1;
    transform: translateX(-100%);
    transition: transform 300ms cubic-bezier(0.25, 0.46, 0.45, 0.94);
  }
  button:hover::after {
    transform: translateX(0);
  }

  /* Text Container Dynamic Size */
  .bgContainer {
    position: relative;
    display: grid;
    align-items: center;
    overflow: hidden;
    font-size: 1.1rem;
    font-weight: 500;
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }
  .bgContainer span {
    grid-area: 1 / 1;
    transition: transform 300ms cubic-bezier(0.25, 0.46, 0.45, 0.94);
    white-space: nowrap;
  }
  
  /* Slide logic */
  .bgContainer span:nth-child(1) {
    transform: translateX(-150%);
  }
  .bgContainer span:nth-child(2) {
    transform: translateX(0);
  }
  .button:hover .bgContainer > span:nth-child(1) {
    transform: translateX(0);
  }
  .button:hover .bgContainer > span:nth-child(2) {
    transform: translateX(150%);
  }

  /* Arrow Settings */
  .arrowContainer {
    padding: 0.7em;
    border: 1px solid rgba(255,255,255,0.2);
    border-radius: 50%;
    background-color: rgba(255,255,255,0.1);
    position: relative;
    overflow: hidden;
    transition: transform 300ms, background-color 300ms;
    z-index: 100;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .arrowContainer::after {
    content: "";
    position: absolute;
    inset: 0;
    border-radius: inherit;
    background-color: #FFFDF8;
    transform: translateX(-100%);
    z-index: -1;
    transition: transform 300ms cubic-bezier(0.25, 0.46, 0.45, 0.94);
  }
  .button:hover .arrowContainer::after {
    transform: translateX(0);
  }
  .button:hover .arrowContainer {
    transform: translateX(4px);
  }
  .button:active .arrowContainer {
    transform: translateX(8px);
  }
  .arrowContainer svg {
    width: 16px;
    height: 16px;
  }
  .arrowContainer svg path {
    fill: #FFFDF8;
    transition: fill 300ms ease-in-out;
  }
  .button:hover .arrowContainer svg path {
    fill: #bc6746;
  }
`;

export default Button;
