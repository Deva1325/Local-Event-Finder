import { Request, Response } from "express";
import CategoryModel from "../models/CategoryModel";
import { isEmpty } from "../utils/validator";
import { successResponse, errorResponse } from "../utils/response";

export const createCategory = async (req: Request, res: Response) => {
    try {
        const { name, description } = req.body;

        if (isEmpty(name)) {
            return errorResponse(res, "Category Name is requires", 400);
        }

        const existingCategory = await CategoryModel.findOne({
            where: { name }
        });

        if (existingCategory) {
            return errorResponse(res, "Category already exists", 400);
        }

        const category = await CategoryModel.create({
            name, description, status: "active"
        });

        return successResponse(res, "Category created successfully!", category, 201);

    } catch (error) {
        console.error("Create Category Error", error);


        return errorResponse(res, "Internal Server Error", 500);
    }
}

export const getCategory = async (req: Request, res: Response) => {
    try {
        const categories = await CategoryModel.findAll({
            where: { status: "active", deleted_at: null },
            order: [["created_at", "DESC"]]
        });

        return successResponse(res, "Catgories fetched Successfully!", categories, 200);

    } catch (error) {
        console.error("Get Categories Error:", error);
        return errorResponse(res, "Internal Server Error", 500);
    }
}

export const getCategoryById = async (req: Request, res: Response) => {
    try {       
        const id = req.params.id as string;
        
        const category = await CategoryModel.findByPk(id);

        if (!category) {
            return errorResponse(res, "Category not found", 404);
        }

        return successResponse(res, "Catgory fetched Successfully!", category, 200);

    } catch (error) {
        console.error("Get Categories Error:", error);
        return errorResponse(res, "Internal Server Error", 500);
    }
}

export const updateCategory = async (req: Request, res: Response) => {
    try {
        const  id  = req.params.id as string;
        const { name, description, status } = req.body;

        const category = await CategoryModel.findByPk(id);

        if (!category) {
            return errorResponse(res, "Category not found", 404);
        }

        await category.update({
            name: name ?? category.name,
            description: description ?? category.description,
            status: status ?? category.status
        });

        return successResponse(res, "Category updated successfully", category, 200);

    } catch (error) {
        console.error("Update Category Error:", error);
        return errorResponse(res, "Internal Server Error", 500);
    }
}

export const deleteCategory = async (req: Request, res: Response) => {
    try {
        const  id  = req.params.id as string;

        if (!id) {
            return errorResponse(res, "ID is required", 400);
        }

        const category = await CategoryModel.findByPk(id);

        if (!category) {
            return errorResponse(res, "Category not found", 404);
        }

        await category.update({
            status : "inactive"
        });

        await category.destroy();

        return successResponse(res, "Category deleted successfully", 200);

    } catch (error) {
        console.error("Update Category Error:", error);
        return errorResponse(res, "Internal Server Error", 500);
    }
}
