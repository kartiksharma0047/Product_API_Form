import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import "./App.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCircleExclamation,
  faTrash,
  faCheck,
  faXmark,
} from "@fortawesome/free-solid-svg-icons";
import { OrbitProgress } from "react-loading-indicators";

function App() {
  const [tags, setTags] = useState([]);
  const [tagInput, setTagInput] = useState("");
  const [showTags, setShowTags] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingIndex, setEditingIndex] = useState(null);
  const [price, setPrice] = useState([]);
  const [selectedCurrency, setSelectedCurrency] = useState("USD");
  const [btnClicked, setBtnClicked] = useState(false);
  const [formSubmitted, setFormSubmitted] = useState(null);
  
  const { register, handleSubmit, setError, clearErrors, reset, formState: { errors } } = useForm();

  useEffect(() => {
    if (formSubmitted !== null) {
      const timer = setTimeout(() => {
        setFormSubmitted(null);
        setBtnClicked(false);
        reset(); // Reset form fields
        setTags([]); // Reset tags specifically
        setSelectedCurrency("USD"); // Reset currency selection
      }, 5000);

      return () => clearTimeout(timer); // Clear timeout on component unmount
    }
  }, [formSubmitted, reset]);

  useEffect(() => {
    fetch("https://api.freecurrencyapi.com/v1/latest?apikey=fca_live_ftWsBHKYX4mLwpTTSW0wDpDy1itKzknzxNEQAA5P")
      .then((response) => response.json())
      .then((data) => {
        const currencies = Object.keys(data.data);
        setPrice(currencies);
      })
      .catch((error) => console.error("Error:", error));
  }, []);

  useEffect(() => {
    if (tags.length === 0) {
      setError("tags", {
        type: "manual",
        message: "At least one tag is required",
      });
    } else {
      clearErrors("tags");
    }
  }, [tags, setError, clearErrors]);

  const onSubmit = (data) => {
    if (tags.length === 0) return;
  
    setBtnClicked(true);
    setFormSubmitted(null); // Reset submission state for loading feedback
  
    submitImage(data.productImage[0]).then((url) => {
      if (url) {
        const formDataObject = {
          productName: data.productName,
          productPrice: data.productPrice,
          productCategory: data.productCategory,
          productDescription: data.productDescription,
          currency: selectedCurrency,
          tags: tags,
          productImage: url,
        };
  
        fetch("https://product-api-form.onrender.com/SubmitData", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formDataObject),
        })
          .then((response) => {
            if (!response.ok) {
              throw new Error("Network response was not ok");
            }
            return response.json();
          })
          .then((data) => {
            console.log("Form Data Submitted:", data);
            setFormSubmitted(true);
          })
          .catch((error) => {
            console.error("Error submitting data:", error);
            setFormSubmitted(false);
          });
      } else {
        setFormSubmitted(false);
      }
    });
  };
  

  const submitImage = (img) => {
    const data = new FormData();
    data.append("file", img);
    data.append("upload_preset", "FormImages(basic)");
    data.append("cloud_name", "dkffr2efj");

    return fetch("https://api.cloudinary.com/v1_1/dkffr2efj/image/upload", {
      method: "POST",
      body: data,
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error("Image upload failed");
        }
        return res.json();
      })
      .then((data) => data.secure_url || null)
      .catch((err) => {
        console.error("Error uploading image:", err);
        return null;
      });
  };

  const handleTagInputChange = (e) => setTagInput(e.target.value);

  const handleAddTag = () => {
    if (tagInput.trim() !== "") {
      if (isEditing) {
        const updatedTags = [...tags];
        updatedTags[editingIndex] = tagInput;
        setTags(updatedTags);
        setIsEditing(false);
      } else {
        setTags([...tags, tagInput]);
      }
      setTagInput("");
    }
  };

  const handleTagSelect = (e) => {
    const selectedTag = e.target.value;
    const index = tags.indexOf(selectedTag);
    setTagInput(selectedTag);
    setIsEditing(true);
    setEditingIndex(index);
  };

  const handleDeleteTag = () => {
    if (isEditing) {
      const updatedTags = tags.filter((_, index) => index !== editingIndex);
      setTags(updatedTags);
      setIsEditing(false);
      setTagInput("");
    }
  };

  const handleToggleTags = () => setShowTags(!showTags);

  return (
    <div className="FormPage">
      <div className={`FormDiv ${btnClicked ? `FormBlur` : ``}`}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <h1>Product Details</h1>
          <div className="ChildFormDiv">
            <div className="EachInputDiv">
              <input
                type="text"
                placeholder="Enter Product Name"
                {...register("productName", { required: "Product name is required" })}
              />
              {errors.productName && <p className="FormErrorDisplay">{errors.productName.message}</p>}
            </div>

            <div className="ProductPrice EachInputDiv">
              <input
                type="number"
                placeholder="Enter Product Price"
                {...register("productPrice", { required: "Price is required" })}
              />
              {errors.productPrice && <p className="FormErrorDisplay">{errors.productPrice.message}</p>}
              <select value={selectedCurrency} onChange={(e) => setSelectedCurrency(e.target.value)}>
                {price.length > 0 ? price.map((ele, index) => (
                  <option key={index} value={ele}>{ele}</option>
                )) : (
                  <option>Loading..</option>
                )}
              </select>
            </div>
          </div>

          <div className="ChildFormDiv">
            <div className="EachInputDiv">
              <input
                type="text"
                placeholder="Enter Product Category"
                {...register("productCategory", { required: "Category is required" })}
              />
              {errors.productCategory && <p className="FormErrorDisplay">{errors.productCategory.message}</p>}
            </div>
            <div className="EachInputDiv">
              <textarea
                placeholder="Enter Product Description"
                {...register("productDescription", { required: "Description is required" })}
              />
              {errors.productDescription && <p className="FormErrorDisplay">{errors.productDescription.message}</p>}
            </div>
          </div>

          <div className="ChildFormDiv">
            <div className="TagDiv EachInputDiv">
              {tags.length > 0 && <FontAwesomeIcon title="Open/Close Edit Menu" icon={faCircleExclamation} onClick={handleToggleTags} />}
              {showTags && (
                <select className="TagList" onChange={handleTagSelect} value={tagInput}>
                  <option value="Tags edit" disabled>Tags edit</option>
                  {tags.map((tag, index) => (
                    <option key={index} value={tag}>{tag}</option>
                  ))}
                </select>
              )}
              <input type="text" placeholder="Enter Product Tags" value={tagInput} onChange={handleTagInputChange} />
              {errors.tags && <p className="FormErrorDisplay">{errors.tags.message}</p>}
              {isEditing && <FontAwesomeIcon icon={faTrash} onClick={handleDeleteTag} />}
              <button type="button" onClick={handleAddTag}>{isEditing ? "Update" : "Add"}</button>
            </div>

            <div className="ImageDiv EachInputDiv">
              <input
                type="file"
                accept="image/*"
                {...register("productImage", { required: "Image is required" })}
              />
              {errors.productImage && <p className="FormErrorDisplay ImageError">{errors.productImage.message}</p>}
            </div>
          </div>

          <button className="SubmitBtn" type="submit">Submit</button>
        </form>
      </div>
      {btnClicked && (
        <div className="Popup">
          {formSubmitted === null ? (
            <div>
              <OrbitProgress id="OrbitProgress" variant="spokes" dense color="#000000" size="large" textColor="#000000" />
              <p>Submitting Details...</p>
            </div>
          ) : formSubmitted ? (
            <div>
              <FontAwesomeIcon icon={faCheck} />
              <p>Details Submitted</p>
            </div>
          ) : (
            <div>
              <FontAwesomeIcon icon={faXmark} />
              <p>An Error Occurred</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default App;
