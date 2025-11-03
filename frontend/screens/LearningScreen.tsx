import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  TextInput,
} from "react-native";
import React, { useCallback, useEffect, useState } from "react";
import { useRoute } from "@react-navigation/native";
import { Course, Project, Question, Section } from "../types/Types";
import { useFetch } from "../hooks/useFetch";
import { ActivityIndicator } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons";
import SectionAccordion from "../components/SectionAccordion";
import { useAuth } from "../contexts/AuthContext";

interface CourseLearning extends Course {
  _id: string;
  title: string;
  thumnail: string;
  lessonCount: number;
  sections: Section[];
  resources: string[];
  questions: Question[];
  projects: Project[];
}

export default function LearningScreen() {
  const router = useRoute();
  const { user } = useAuth()
  const { _id } = router.params as { _id: string };
  const { get, isLoading } = useFetch(process.env.EXPO_PUBLIC_BASE_URL);
  const [course, setCourse] = useState<CourseLearning | null>(null);
  const [activeTab, setActiveTab] = useState<"LESSONS" | "PROJECTS" | "Q&A">(
    "LESSONS"
  );

  const formatTimeAgo = (dateString: string) => {
    const now = new Date();
    const past = new Date(dateString);
    const diffInHours = Math.floor(
      (now.getTime() - past.getTime()) / (1000 * 60 * 60)
    );

    if (diffInHours < 1) return "Just now";
    if (diffInHours < 24) return `${diffInHours}h ago`;
    if (diffInHours < 48) return "Yesterday";
    return `${Math.floor(diffInHours / 24)}d ago`;
  };

  const fetchCourse = useCallback(async () => {
    if (!isLoading) {
      const data = await get(`/courses/learning/${_id}`);
      setCourse(data.course);
    }
  }, [_id]);

  useEffect(() => {
    fetchCourse();
  }, [_id]);

  if (!course)
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#6366f1" />
      </View>
    );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.heroContainer}>
          <Image
            source={{ uri: (course as Course)?.thumbnail }}
            style={{ width: "100%", height: "100%", borderRadius: 12 }}
          />
          <TouchableOpacity style={styles.playButton}>
            <Feather name="play" size={20} color="#7c3aed" />
          </TouchableOpacity>
        </View>

        <View style={styles.courseTitleSection}>
          <Text style={styles.courseTitle}>{(course as Course)?.title}</Text>
          <Text style={styles.lessonCount}>
            {(course as Course)?.lessonCount} lessons
          </Text>
        </View>

        <View style={styles.tabContainer}>
          {["LESSONS", "PROJECTS", "Q&A"].map((tab) => (
            <TouchableOpacity
              key={tab}
              onPress={() => setActiveTab(tab as any)}
              style={styles.tabButton}
            >
              <Text
                style={[
                  styles.tabText,
                  activeTab === tab && styles.tabTextActive,
                ]}
              >
                {tab.toUpperCase()}
              </Text>
              {activeTab === tab && <View style={styles.tabUnderline} />}
            </TouchableOpacity>
          ))}
        </View>

        {activeTab === "LESSONS" && (
          <View style={styles.tabContent}>
            {(course as Course)?.sections?.length ? (
              (course as Course)?.sections.map((s, i) => (
                <SectionAccordion key={i} section={s} />
              ))
            ) : (
              <Text style={{ color: "#666" }}>No lessons available.</Text>
            )}
          </View>
        )}

        {activeTab === "PROJECTS" && (
          <View style={styles.tabContent}>
            {/* Upload Project Section */}
            <View style={styles.uploadSection}>
              <Text style={styles.uploadTitle}>Upload your project</Text>
              <TouchableOpacity style={styles.uploadBox}>
                <Feather name="upload-cloud" size={32} color="#06b6d4" />
                <Text style={styles.uploadText}>Upload your project here</Text>
              </TouchableOpacity>
            </View>

            {/* Student Projects */}
            <View style={styles.studentProjectsHeader}>
              <Text style={styles.studentProjectsCount}>
                {course?.projects?.length || 0} Student Projects
              </Text>
              <TouchableOpacity>
                <Text style={styles.viewMoreText}>View more</Text>
              </TouchableOpacity>
            </View>

            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              style={styles.studentProjectsScroll}
              contentContainerStyle={styles.studentProjectsContainer}
            >
              {course?.projects?.length > 0 ? (
                course.projects.map((project) => (
                  <View key={project._id} style={styles.projectCardHorizontal}>
                    <Image
                      source={{
                        uri: "https://t4.ftcdn.net/jpg/04/90/00/23/360_F_490002303_Alk0GdfmBRyL0KTUQ9wDs0Ax1lDgqlTo.jpg",
                      }}
                      style={styles.projectThumbnailHorizontal}
                    />
                    <View style={styles.projectInfoHorizontal}>
                      <Text style={styles.projectAuthorHorizontal}>
                        {typeof project.userId === "object"
                          ? project.userId.name
                          : "Anonymous"}
                      </Text>
                      <Text
                        style={styles.projectTitleHorizontal}
                        numberOfLines={2}
                      >
                        {project.title}
                      </Text>
                    </View>
                  </View>
                ))
              ) : (
                <Text style={styles.noDataTextHorizontal}>
                  No projects submitted yet.
                </Text>
              )}
            </ScrollView>

            {/* Project Description */}
            <View style={styles.projectDescriptionSection}>
              <Text style={styles.projectDescriptionTitle}>
                Project Description
              </Text>
              <Text style={styles.projectDescriptionText} numberOfLines={4}>
                {course.description}
              </Text>
              <TouchableOpacity>
                <Text style={styles.seeMoreText}>See more</Text>
              </TouchableOpacity>
            </View>

            {/* Resources */}
            <View style={styles.resourcesSection}>
              <Text style={styles.resourcesTitle}>Resources ({course?.resources?.length || 0})</Text>
              {course?.resources?.length > 0 ? (
                course.resources.map((resource, index) => (
                  <TouchableOpacity key={index} style={styles.resourceItem}>
                    <Feather
                      name={resource.endsWith(".pdf") ? "file-text" : "file"}
                      size={20}
                      color="#666"
                    />
                    <View style={styles.resourceInfo}>
                      <Text style={styles.resourceName}>
                        {resource.split("/").pop() || `Document ${index + 1}`}
                      </Text>
                      <Text style={styles.resourceSize}>
                        {index === 0 ? "612 Kb" : "35 Mb"}
                      </Text>
                    </View>
                    <Feather name="download" size={20} color="#666" />
                  </TouchableOpacity>
                ))
              ) : (
                <Text style={styles.noDataText}>No resources available.</Text>
              )}
            </View>
          </View>
        )}

        {activeTab === "Q&A" && (
  <View style={styles.qaTabContainer}>
    {/* Danh sách câu hỏi - cuộn được */}
    <ScrollView
      style={styles.qaScrollView}
      showsVerticalScrollIndicator={false}
      keyboardShouldPersistTaps="handled"
    >
      <View style={styles.qaList}>
        {course?.questions?.length > 0 ? (
          course.questions.map((question) => (
            <View key={question._id} style={styles.qaItem}>
              <View style={styles.qaHeader}>
                <Image
                  source={{
                    uri:
                      typeof question.userId === "object" && question.userId.avatar
                        ? question.userId.avatar
                        : "https://via.placeholder.com/40",
                  }}
                  style={styles.qaAvatar}
                />
                <View style={styles.qaUserInfo}>
                  <Text style={styles.qaUserName}>
                    {typeof question.userId === "object"
                      ? question.userId.name
                      : "Anonymous"}
                  </Text>
                  <Text style={styles.qaTime}>
                    {formatTimeAgo(question.createdAt)}
                  </Text>
                </View>
              </View>

              <Text style={styles.qaContent}>{question.content}</Text>

              <View style={styles.qaActions}>
                <TouchableOpacity style={styles.qaAction}>
                  <Feather name="heart" size={16} color="#666" />
                  <Text style={styles.qaActionText}>{question.likes}</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.qaAction}>
                  <Feather name="message-circle" size={16} color="#666" />
                  <Text style={styles.qaActionText}>
                    {question.answers?.length || 0} Comment
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          ))
        ) : (
          <Text style={styles.noDataText}>No questions yet.</Text>
        )}
      </View>
      {/* Khoảng trống dưới để không bị che bởi input */}
      <View style={{ height: 80 }} />
    </ScrollView>

    {/* Ô nhập câu hỏi - dính dưới */}
    <View style={styles.qaInputContainer}>
      <Image
        source={{ uri: user?.avatar || "https://via.placeholder.com/36" }}
        style={styles.qaInputAvatar}
      />
      <TextInput
        style={styles.qaInput}
        placeholder="Write a Q&A..."
        placeholderTextColor="#999"
        multiline
        textAlignVertical="center"
      />
      <TouchableOpacity style={styles.qaSendButton}>
        <Feather name="send" size={20} color="#06b6d4" />
      </TouchableOpacity>
    </View>
  </View>
)}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  centered: { flex: 1, justifyContent: "center", alignItems: "center" },
  heroContainer: {
    height: 250,
    marginHorizontal: 16,
    marginBottom: 8,
    borderRadius: 16,
    position: "relative",
    overflow: "hidden",
  },
  playButton: {
    position: "absolute",
    left: "50%",
    top: "50%",
    marginLeft: -25,
    marginTop: -25,
    backgroundColor: "#fff",
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
  },
  courseTitleSection: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: "#fff",
    marginBottom: 4,
  },
  courseTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#000",
    marginBottom: 8,
  },
  lessonCount: {
    fontSize: 12,
    color: "#666",
    fontWeight: "500",
  },
  tabContainer: {
    flexDirection: "row",
    backgroundColor: "#fff",
    borderBottomWidth: 0,
    paddingBottom: 0,
  },
  tabButton: {
    flex: 1,
    paddingVertical: 12,
    alignItems: "center",
    position: "relative",
  },
  tabText: {
    fontSize: 12,
    color: "#94a3b8",
    fontWeight: "600",
    letterSpacing: 0.5,
  },
  tabTextActive: {
    color: "#06b6d4",
    fontWeight: "700",
  },
  tabUnderline: {
    position: "absolute",
    bottom: 0,
    left: "20%",
    right: "20%",
    height: 3,
    backgroundColor: "#06b6d4",
    borderRadius: 1.5,
  },
  tabContent: { padding: 16, paddingTop: 12 },
  coursesSection: { paddingTop: 16, paddingBottom: 20 },
  rowBetween: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  uploadSection: {
    paddingHorizontal: 16,
    marginBottom: 24,
  },
  uploadTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#000",
    marginBottom: 12,
  },
  uploadBox: {
    borderWidth: 2,
    borderColor: "#06b6d4",
    borderStyle: "dashed",
    borderRadius: 12,
    height: 100,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f8fffe",
  },
  uploadText: {
    marginTop: 8,
    color: "#06b6d4",
    fontSize: 14,
    fontWeight: "500",
  },
  studentProjectsHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  studentProjectsCount: {
    fontSize: 16,
    fontWeight: "600",
    color: "#000",
  },
  viewMoreText: {
    color: "#06b6d4",
    fontSize: 14,
    fontWeight: "500",
  },
  studentProjectsScroll: {
    marginBottom: 24,
  },
  studentProjectsContainer: {
    paddingHorizontal: 16,
    paddingRight: 32, // thêm khoảng trống cuối
  },
  projectCardHorizontal: {
    width: 140,
    marginRight: 12,
    backgroundColor: "#fff",
    borderRadius: 12,
    overflow: "hidden",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  projectThumbnailHorizontal: {
    width: "100%",
    height: 90,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
  projectInfoHorizontal: {
    padding: 10,
  },
  projectAuthorHorizontal: {
    fontSize: 12,
    color: "#666",
    marginBottom: 2,
  },
  projectTitleHorizontal: {
    fontSize: 13,
    fontWeight: "600",
    color: "#000",
    lineHeight: 16,
  },
  noDataTextHorizontal: {
    color: "#666",
    fontSize: 14,
    paddingHorizontal: 16,
    paddingVertical: 20,
  },
  projectDescriptionSection: {
    paddingHorizontal: 16,
    marginBottom: 24,
  },
  projectDescriptionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#000",
    marginBottom: 8,
  },
  projectDescriptionText: {
    fontSize: 14,
    color: "#444",
    lineHeight: 20,
  },
  seeMoreText: {
    color: "#06b6d4",
    fontSize: 14,
    fontWeight: "500",
    marginTop: 4,
  },
  resourcesSection: {
    paddingHorizontal: 16,
  },
  resourcesTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#000",
    marginBottom: 12,
  },
  resourceItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#f1f5f9",
  },
  resourceInfo: {
    flex: 1,
    marginLeft: 12,
  },
  resourceName: {
    fontSize: 14,
    color: "#000",
    fontWeight: "500",
  },
  resourceSize: {
    fontSize: 12,
    color: "#888",
  },
  noDataText: {
    color: "#666",
    fontSize: 14,
    textAlign: "center",
    padding: 20,
  },
 qaTabContainer: {
  flex: 1,
  justifyContent: "space-between",
},
qaScrollView: {
  flex: 1,
},
qaList: {
  padding: 16,
  paddingBottom: 0,
},
qaItem: {
  backgroundColor: "#f9f9f9",
  padding: 16,
  borderRadius: 12,
  marginBottom: 12,
},
qaHeader: {
  flexDirection: "row",
  alignItems: "center",
  marginBottom: 8,
},
qaAvatar: {
  width: 40,
  height: 40,
  borderRadius: 20,
  marginRight: 12,
},
qaUserInfo: {
  flex: 1,
},
qaUserName: {
  fontSize: 14,
  fontWeight: "600",
  color: "#000",
},
qaTime: {
  fontSize: 12,
  color: "#888",
},
qaContent: {
  fontSize: 14,
  color: "#333",
  lineHeight: 20,
  marginBottom: 12,
},
qaActions: {
  flexDirection: "row",
  alignItems: "center",
},
qaAction: {
  flexDirection: "row",
  alignItems: "center",
  marginRight: 20,
},
qaActionText: {
  marginLeft: 4,
  fontSize: 13,
  color: "#666",
},

// Ô nhập câu hỏi - dính dưới
qaInputContainer: {
  flexDirection: "row",
  alignItems: "center",
  paddingHorizontal: 16,
  paddingVertical: 12,
  backgroundColor: "#fff",
  borderTopWidth: 1,
  borderTopColor: "#f1f5f9",
},
qaInputAvatar: {
  width: 36,
  height: 36,
  borderRadius: 18,
  marginRight: 12,
},
qaInput: {
  flex: 1,
  fontSize: 14,
  color: "#000",
  backgroundColor: "#f1f5f9",
  borderRadius: 20,
  paddingHorizontal: 16,
  paddingVertical: 10,
  maxHeight: 100,
},
qaSendButton: {
  marginLeft: 8,
  padding: 8,
},
});
