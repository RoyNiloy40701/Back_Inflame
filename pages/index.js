import Head from "next/head";
import { IoHome } from "react-icons/io5";
import { useEffect, useState } from "react";
import LoginLayout from "@/components/LoginLayout";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

export default function Home() {
  const [blogsData, setBlogsData] = useState([]);
  const [projectData, setProjectData] = useState([]); // ✅ Added
  const [loadingData, setLoading] = useState(true);

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: true,
        text: "Blog Created Monthly by Year",
      },
    },
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const blogsResponse = await fetch("/api/blogs");
        const projectsResponse = await fetch("/api/projects");

        const blogsData = await blogsResponse.json();
        const projectsData = await projectsResponse.json();

        setBlogsData(blogsData);
        setProjectData(projectsData);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const monthlyData = blogsData
    .filter((dat) => dat.status === "publish")
    .reduce((acc, blog) => {
      const year = new Date(blog.createdAt).getFullYear();
      const month = new Date(blog.createdAt).getMonth();
      acc[year] = acc[year] || Array(12).fill(0);
      acc[year][month]++;
      return acc;
    }, {});

  const labels = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "June",
    "July",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  const years = Object.keys(monthlyData);

  const datasets = years.map((year) => ({
    label: `${year}`,
    data: monthlyData[year] || Array(12).fill(0),
    backgroundColor: `rgba(${Math.floor(Math.random() * 256)}, ${Math.floor(
      Math.random() * 256
    )}, ${Math.floor(Math.random() * 256)}, 0.5)`,
  }));

  const data = {
    labels,
    datasets,
  };

  return (
    <>
      <Head>
        <title>Inflame Solution Backend</title>
        <meta name="description" content="Blog website backend" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <div className="dashboard">
        <div className="titledashboard flex flex-sb">
          <div>
            <h2>
              Admin <span>Dashboard</span>
            </h2>
            <h3>ADMIN PANEL</h3>
          </div>
          <div className="breadcrumb">
            <IoHome />
            <span>/</span>
            <span>Dashboard</span>
          </div>
        </div>

        <div className="topfourcards flex flex-sb">
          <div className="four_card">
            <h2>Total Blogs</h2>
            <span>
              {blogsData.filter((dat) => dat.status === "publish").length}
            </span>
          </div>
          <div className="four_card">
            <h2>All Service</h2>
            <span>5</span>
          </div>
          <div className="four_card">
            <h2>All projects</h2>
            <span>{projectData.length}</span>
          </div>
          <div className="four_card">
            <h2>Contact Us</h2>
            <span>5</span>
          </div>
        </div>

        <div className="year_overiew flex flex-sb">
          <div className="leftyearoverview">
            <div className="flex flex-sb">
              <h3>Year Overview</h3>
              <ul className="creative-dots">
                <li className="big-dot"></li>
                <li className="semi-big-dot"></li>
                <li className="medium-dot"></li>
                <li className="semi-medium-dot"></li>
                <li className="semi-small-dot"></li>
                <li className="small-dot"></li>
              </ul>
              <h3 className="text-right">
                10/365 <br />
                <span>Total Publish</span>
              </h3>
            </div>
            <Bar data={data} options={options} />
          </div>

          <div className="right_salescont">
            <div>
              <h3>Blogs By category </h3>
              <ul className="creative-dots">
                <li className="big-dot"></li>
                <li className="semi-big-dot"></li>
                <li className="medium-dot"></li>
                <li className="semi-medium-dot"></li>
                <li className="semi-small-dot"></li>
                <li className="small-dot"></li>
              </ul>
            </div>
            <div className="blogscategory flex flex-center">
              <table>
                <thead>
                  <tr>
                    <td>Web Development</td>
                    <td>
                      {
                        blogsData.filter(
                          (dat) =>
                            dat.blogscaterory?.[0]?.trim() === "Node Js"
                        ).length
                      }
                    </td>
                  </tr>
                  <tr>
                    <td>Software Development</td>
                    <td>
                      {
                        blogsData.filter(
                          (dat) =>
                            dat.blogscaterory?.[0]?.trim() === "React Js"
                        ).length
                      }
                    </td>
                  </tr>
                  <tr>
                    <td>Creative Design</td>
                    <td>
                      {
                        blogsData.filter(
                          (dat) =>
                            dat.blogscaterory?.[0]?.trim() === "Next Js"
                        ).length
                      }
                    </td>
                  </tr>
                  <tr>
                    <td>Organic Marketing</td>
                    <td>
                      {
                        blogsData.filter(
                          (dat) =>
                            dat.blogscaterory?.[0]?.trim() === "CSS"
                        ).length
                      }
                    </td>
                  </tr>
                  <tr>
                    <td>Paid Marketing</td>
                    <td>
                      {
                        blogsData.filter(
                          (dat) =>
                            dat.blogscaterory?.[0]?.trim() ===
                            "Digital Marketing"
                        ).length
                      }
                    </td>
                  </tr>
                </thead>
              </table>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
