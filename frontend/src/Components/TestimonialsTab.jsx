import "../styles/testimonialsTab.css";

const TestimonialsTab = ({ name, designation, img, order }) => {
  return (
    <div className={`m-testimonials-tab m-testimonials-tab-${order}`}>
      <div className={`m-testimonials-overlay-${order}`}></div>
      <img src={img} alt="name" height={87} width={87} />
      <div>
        <h2 className="m-testimonial-name">{name}</h2>
        <h3 className="m-testimonial-designation">{designation}</h3>
      </div>
    </div>
  );
};
export default TestimonialsTab;
