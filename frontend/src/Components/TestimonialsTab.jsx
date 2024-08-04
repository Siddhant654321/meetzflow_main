import "../styles/testimonialsTab.css";

const TestimonialsTab = ({ name, designation, img }) => {
  return (
    <div className="m-testimonials-tab">
      <img src={img} alt="name" height={87} width={87} />
      <div>
        <h2 className="m-testimonial-name">{name}</h2>
        <h3 className="m-testimonial-designation">{designation}</h3>
      </div>
    </div>
  );
};
export default TestimonialsTab;
