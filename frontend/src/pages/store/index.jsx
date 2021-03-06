import React, { useEffect, useState, useRef } from "react";
import AsideWidgetFilter from "./components/AsideWidget";
import AsideWidgetPrice from "./components/AsideWidgetPrice";
import { useSelector } from "react-redux";
import "./index.css";
import typeProduct from "../../util/products/typeProduct";
import productsApi from "../../apis/product";
import ProductWidgetTab from "../../components/productWidgetTab";
import ProductCard from "../../components/Card/ProductCard";
import MetaTags from "react-meta-tags";

export default function Store() {
  const [brands, setBrands] = useState([]);
  const [products, setProducts] = useState([]);
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(9);
  const [sortBy, setSortBy] = useState("price_after_discount");
  const [typeSort, setTypeSort] = useState("DESC");
  const timeoutFetch = useRef(true);
  const filter = useSelector((state) => state.filterProduct);

  useEffect(() => {
    if (timeoutFetch.current) {
      fetchProducts();
      timeoutFetch.current = false;
      setTimeout(() => (timeoutFetch.current = true), 1000);
    }
  }, [filter, sortBy, page, size, typeSort]);
  useEffect(() => {
    fetchBrands();
  }, []);
  const fetchProducts = () => {
    productsApi
      .getProducts({
        page: page,
        size: size,
        brand_name: filter.brand_names,
        type_of_product: filter.type_of_products,
        min_price: filter.minPrice,
        max_price: filter.maxPrice,
        sort_by: sortBy,
        type_sort: typeSort,
      })
      .then((res) => {
        setProducts(res);
      })
      .catch((e) => console.log(e));
  };
  const fetchBrands = () => {
    productsApi
      .getBrands()
      .then((res) => {
        const brands = res.map((item) => item.brand_name);
        setBrands(brands);
      })
      .catch((e) => console.log(e));
  };
  const handelSort = (e) => {
    const value = e.target.value;
    if (value === "price_hight") {
      setSortBy("price_after_discount");
      setTypeSort("DESC");
    } else if (value === "price_low") {
      setSortBy("price_after_discount");
      setTypeSort("ASC");
    } else {
      setSortBy(value);
      setTypeSort("DESC");
    }
  };
  return (
    <div class="section">
      <MetaTags>
        <title>BK Computer</title>
        <meta
          name="description"
          content="H??ng 100% ch??nh h??ng ???????c ph??n ph???i b???i h??? th???ng b??n l??? k??? thu???t s??? BK Computer c??ng v???i nhi???u khuy???n m??i h???p d???n, b???o h??nh ch??nh h??ng. Mua tr???c tuy???n gi?? r??? "
        />
        <meta
          name="keywords"
          content="laptop, gi?? r???, smartphone, ??i???n tho???i, m??y t??nh"
        />
      </MetaTags>
      <div class="container">
        <div class="row">
          <div id="aside" class="col-md-3">
            <AsideWidgetFilter
              title="Danh m???c"
              items={typeProduct}
              field="type_of_products"
            />
            <AsideWidgetPrice />
            <AsideWidgetFilter
              title="Th????ng hi???u"
              items={brands}
              field="brand_names"
            />
            <div class="aside">
              <ProductWidgetTab keyWorkFilter="release_time" />
            </div>
          </div>
          {/* <!-- /ASIDE --> */}

          {/* <!-- STORE --> */}
          <div id="store" class="col-md-9">
            {/* <!-- store top filter --> */}
            <div class="store-filter clearfix">
              <div class="store-sort">
                <label>
                  S???p x???p theo:
                  <select
                    class="input-select"
                    defaultValue="price"
                    onChange={handelSort}
                  >
                    <option value="price_hight">Gi?? t??? cao ?????n th???p </option>
                    <option value="price_low">Gi?? t??? th???p ?????n cao</option>
                    <option value="discount_percent">Khuy???n M??i</option>
                    <option value="release_time">N??m ph??t h??nh</option>
                  </select>
                </label>

                <label>
                  Hi???n th???:
                  <select
                    class="input-select"
                    onChange={(e) => setSize(e.target.value)}
                    defaultValue="9"
                  >
                    <option value="9">9</option>
                    <option value="18">18</option>
                    <option value="45">45</option>
                    <option value="90">90</option>
                  </select>
                </label>
              </div>
            </div>
            {/* <!-- /store top filter --> */}

            {/* <!-- store products --> */}
            <div class="row">
              {products.map((product, index) => (
                <div key={product.product_id} class="col-md-4 col-sm-6">
                  <ProductCard product={product} />
                </div>
              ))}
              {/* <!-- /product --> */}
            </div>
            {/* <!-- /store products --> */}

            {/* <!-- store bottom filter --> */}
            <div class="store-filter clearfix">
              <span class="store-qty">Hi???n th??? 20-100 s???n ph???m</span>
              <ul class="store-pagination">
                {[-2, -1, 0, 1, 2, 3, 4]
                  .map((i) => i + page + 1)
                  .filter((i) => i > 0)
                  .slice(0, 4)
                  .map((i) => (
                    <li
                      value={i}
                      class={i === page + 1 ? "active" : ""}
                      onClick={(e) => setPage(e.target.value - 1)}
                    >
                      {i}
                    </li>
                  ))}
                <li onClick={() => setPage(page + 1)}>
                  <a>
                    <i class="fa fa-angle-right"></i>
                  </a>
                </li>
              </ul>
            </div>
            {/* <!-- /store bottom filter --> */}
          </div>
          {/* <!-- /STORE --> */}
        </div>
        {/* <!-- /row --> */}
      </div>

      {/* <!-- /container --> */}
    </div>
  );
}
