import "../styles/testimonialsTab.css";

const TestimonialsTab = ({
  name,
  designation,
  img,
  active,
  order,
  goToSlide,
  activeIndex,
}) => {
  const calculateOrder = () => {
    if ((order === 0 && activeIndex !== 5) || activeIndex === 0) {
      return order;
    } else {
      return order === -1 ? 5 : order === 0 ? 6 : order;
    }
  };

  const newOrder = calculateOrder();

  return (
    <div
      className={`m-testimonials-tab m-testimonials-tab-${active}`}
      onClick={() => goToSlide(newOrder)}
    >
      <img src={img} alt="name" height={87} width={87} />
      <div>
        <h2 className="m-testimonial-name">{name}</h2>
        <h3 className="m-testimonial-designation">{designation}</h3>
      </div>
    </div>
  );
};
export default TestimonialsTab;
